import { BulkWriteOperation, Db, FilterQuery, ObjectId } from "mongodb";
import {
  InterestCollection,
  UserAccountCollection,
  UserTimelineCollection,
  UserTimelineModel,
  PostCollection,
  PostModel,
  TimelineItemType,
  UserAccountModel,
  InterestModel,
  InterestSerialized,
  TimelineItem,
  AbuseModel,
  AbuseCollection,
} from "@bubble/common";

export const getUserById = async (
  db: Db,
  user_id: string
): Promise<UserAccountModel> => {
  const user = await db
    .collection<UserAccountModel>(UserAccountCollection)
    .findOne({ _id: user_id });

  if (user === null) throw new Error("User not found");

  return user;
};

export const createUser = async (db: Db, user: UserAccountModel) => {
  await db.collection<UserAccountModel>(UserAccountCollection).insertOne(user);
};

export const checkUsernameAvailable = async (
  db: Db,
  username: string
): Promise<boolean> => {
  const result = await db
    .collection<UserAccountModel>(UserAccountCollection)
    .countDocuments({ username: username });

  return result === 0;
};

export const addUserInterest = async (
  db: Db,
  user_id: string,
  interest_id: string
) => {
  await db
    .collection<UserAccountModel>(UserAccountCollection)
    .updateOne({ _id: user_id }, { $addToSet: { likes: interest_id } });
};

export const removeUserInterest = async (
  db: Db,
  user_id: string,
  interest_id: string
) => {
  await db
    .collection<UserAccountModel>(UserAccountCollection)
    .updateOne({ _id: user_id }, { $pull: { likes: interest_id } });
};

export const getInterest = async (
  db: Db,
  interest_id: string
): Promise<InterestModel> => {
  const interest = await db
    .collection<InterestModel>(InterestCollection)
    .findOne({ _id: interest_id });

  if (interest === null) {
    throw new Error("Interest page not found");
  }

  return interest;
};

export const getRandomInterest = async (
  db: Db,
  n: number
): Promise<InterestModel[]> => {
  const result = db
    .collection<InterestModel>(InterestCollection)
    .aggregate([{ $sample: { size: n } }]);

  return await result.toArray();
};

export const searchInterest = async (
  db: Db,
  query: string
): Promise<InterestModel[]> => {
  const result = db
    .collection<InterestModel>(InterestCollection)
    .find({ $text: { $search: query } }, { limit: 100 });

  return await result.toArray();
};

export const createInterest = async (
  db: Db,
  metadata: Pick<InterestSerialized, "_id" | "description" | "name">
): Promise<InterestModel> => {
  const newInterest: InterestModel = {
    ...metadata,
    followers: [],
    followers_aggregate: 0,
    posts: [],
  };

  await db.collection<InterestModel>(InterestCollection).insertOne(newInterest);

  return newInterest;
};

export const addInterestFollower = async (
  db: Db,
  user_id: string,
  interest_id: string
) => {
  await db
    .collection<InterestModel>(InterestCollection)
    .updateOne(
      { _id: interest_id },
      { $addToSet: { followers: user_id }, $inc: { followers_aggregate: 1 } }
    );
};

export const addInterestFollowerMany = async (
  db: Db,
  user_id: string,
  interest_ids: string[]
) => {
  const updateOperations: BulkWriteOperation<InterestModel>[] = [];

  interest_ids.forEach((interest_id) => {
    updateOperations.push({
      updateOne: {
        filter: {
          _id: interest_id,
        },
        update: {
          $addToSet: {
            followers: user_id,
          },
          $inc: {
            followers_aggregate: 1,
          },
        },
      },
    });
  });

  await db
    .collection<InterestModel>(InterestCollection)
    .bulkWrite(updateOperations);
};

export const removeInterestFollower = async (
  db: Db,
  user_id: string,
  interest_id: string
) => {
  await db
    .collection<InterestModel>(InterestCollection)
    .updateOne(
      { _id: interest_id },
      { $pull: { followers: user_id }, $inc: { followers_aggregate: -1 } }
    );
};

export const checkInterest = async (
  db: Db,
  interest_id: string
): Promise<boolean> => {
  return (
    (await db
      .collection<InterestModel>(InterestCollection)
      .findOne({ _id: interest_id }, { projection: { _id: 1 } })) !== null
  );
};

export const checkInterestMany = async (
  db: Db,
  interest_ids: string[]
): Promise<boolean> => {
  const result = await Promise.all(
    interest_ids.map((id) => checkInterest(db, id))
  );

  return result.every((val) => val === true);
};

export const getTimelineById = async (
  db: Db,
  user_id: string
): Promise<UserTimelineModel> => {
  const timeline = await db
    .collection<UserTimelineModel>(UserTimelineCollection)
    .findOne({ _id: user_id });

  if (timeline === null) throw new Error("User timeline not found");

  return timeline;
};

export const createUserTimeline = async (db: Db, user_id: string) => {
  const timeline: UserTimelineModel = {
    _id: user_id,
    timeline: [],
  };

  await db
    .collection<UserTimelineModel>(UserTimelineCollection)
    .insertOne(timeline);
};

export const addTimelineItem = async (
  db: Db,
  user_id: string,
  post_id: string,
  type: TimelineItemType
) => {
  const postObjectId = new ObjectId(post_id);
  await db.collection<UserTimelineModel>(UserTimelineCollection).updateOne(
    {
      _id: user_id,
      "timeline.post_id": { $ne: postObjectId },
    },
    {
      $push: {
        timeline: {
          $each: [
            {
              post_id: postObjectId,
              type: type,
              seen: false,
              liked: false,
              reported: false,
            },
          ],
          $position: 0,
        },
      },
    }
  );
};

export const getPostById = async (
  db: Db,
  post_id: string
): Promise<PostModel> => {
  const post = await db
    .collection<PostModel>(PostCollection)
    .findOne({ _id: new ObjectId(post_id) });

  if (post === null) throw new Error("Post is not found");

  return post;
};

export const createPost = async (
  db: Db,
  metadata: Pick<PostModel, "media" | "content" | "part_of" | "author">
) => {
  const result = await db.collection<PostModel>(PostCollection).insertOne({
    ...metadata,
    deleted: false,
    like: [],
    like_aggregate: 0,
    seen: [],
    seen_aggregate: 0,
    time_posted: new Date(),
  });

  return result.ops[0];
};

/* WARNING : On big write to many subscriber to an interest could make hickups on the database */
/* On future update spreading a post should priotized eventual update, than real time update */
export const spreadPost = async (
  db: Db,
  post_id: string,
  poster_id: string,
  interest_id: string
) => {
  const postObjectId = new ObjectId(post_id);
  const timelineItem: TimelineItem = {
    post_id: postObjectId,
    type: TimelineItemType.followed,
    seen: false,
    liked: false,
    reported: false,
  };

  const result = await db
    .collection<InterestModel>(InterestCollection)
    .findOneAndUpdate(
      { _id: interest_id },
      { $push: { posts: { $position: 0, $each: [postObjectId] } } }
    );

  const updateOperations: BulkWriteOperation<UserTimelineModel>[] = [
    {
      updateOne: {
        filter: {
          _id: poster_id,
        },
        update: {
          $push: {
            timeline: { $each: [timelineItem], $position: 0 },
          },
        },
      },
    },
  ];

  result.value?.followers.forEach((follower) => {
    if (follower === poster_id) return;

    updateOperations.push({
      updateOne: {
        filter: {
          _id: follower,
        },
        update: {
          $push: {
            timeline: { $each: [timelineItem], $position: 0 },
          },
        },
      },
    });
  });

  await db
    .collection<UserTimelineModel>(UserTimelineCollection)
    .bulkWrite(updateOperations, { ordered: false });
};

export const updateLike = async (
  db: Db,
  user_id: string,
  post_id: string,
  liked: boolean
) => {
  const postObjectId = new ObjectId(post_id);

  const timelineUpdate = db
    .collection<UserTimelineModel>(UserTimelineCollection)
    .updateOne(
      { _id: user_id, "timeline.post_id": postObjectId },
      { $set: { "timeline.$.liked": liked } }
    );

  if (liked) {
    const postUpdate = db.collection<PostModel>(PostCollection).updateOne(
      { _id: postObjectId, "like.by": { $ne: user_id } },
      {
        $push: { like: { by: user_id, time: new Date() } },
        $inc: { like_aggregate: 1 },
      }
    );

    await Promise.all([timelineUpdate, postUpdate]);
    return;
  } else {
    const postUpdate = db
      .collection<PostModel>(PostCollection)
      .updateOne(
        { _id: postObjectId },
        { $pull: { like: { by: user_id } }, $inc: { like_aggregate: -1 } }
      );

    await Promise.all([timelineUpdate, postUpdate]);
    return;
  }
};

export const updateSeen = async (db: Db, user_id: string, post_id: string) => {
  const postObjectId = new ObjectId(post_id);

  const timelineUpdate = db
    .collection<UserTimelineModel>(UserTimelineCollection)
    .updateOne(
      { _id: user_id, "timeline.post_id": postObjectId },
      { $set: { "timeline.$.seen": true } }
    );

  const postUpdate = db.collection<PostModel>(PostCollection).updateOne(
    { _id: postObjectId, "seen.by": { $ne: user_id } },
    {
      $push: {
        seen: {
          by: user_id,
          time: new Date(),
        },
      },
      $inc: {
        seen_aggregate: 1,
      },
    }
  );

  await Promise.all([timelineUpdate, postUpdate]);
};

export const getAbuseById = async (
  db: Db,
  post_id: string
): Promise<AbuseModel> => {
  const abuse = await db.collection<AbuseModel>(AbuseCollection).findOne({
    _id: new ObjectId(post_id),
  });

  if (abuse === null)
    throw new Error("Abuse reports are not available for this post");

  return abuse;
};

export const getManyAbuse = async (
  db: Db,
  n: number,
  last_id?: string
): Promise<AbuseModel[]> => {
  let filter: FilterQuery<AbuseModel> = {};

  if (last_id) {
    filter = { _id: { $gt: new ObjectId(last_id) } };
  }

  const cursor = db.collection<AbuseModel>(AbuseCollection).find(filter);

  return await cursor.sort({ last_updated: -1, _id: -1 }).limit(n).toArray();
};

export const updateAbuse = async (
  db: Db,
  post_id: string,
  reportee: string,
  reason: string
) => {
  await db.collection<AbuseModel>(AbuseCollection).updateOne(
    {
      _id: new ObjectId(post_id),
      reportee: { $ne: reportee },
    },
    {
      $push: {
        reason: {
          $each: [reason],
          $position: 0,
        },
        reportee: reportee,
      },
      $set: {
        last_updated: new Date(),
      },
    },
    { upsert: true }
  );
};

export const updateUserReportTimeline = async (
  db: Db,
  post_id: string,
  reportee: string
) => {
  await db.collection<UserTimelineModel>(UserTimelineCollection).updateOne(
    {
      _id: reportee,
      "timeline.post_id": new ObjectId(post_id),
    },
    {
      $set: { "timeline.$.reported": true },
    }
  );
};
