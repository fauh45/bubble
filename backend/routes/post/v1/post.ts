import { FastifyPluginAsync } from "fastify";
import {
  Error401Default,
  InteractionItem,
  InteractionItemSerialized,
  PostActionV1Actions,
  PostActionV1PostError,
  PostActionV1PostHeaders,
  PostActionV1PostParams,
  PostActionV1PostResponse,
  PostCollection,
  PostModel,
  PostSerialized,
  PostV1GetError,
  PostV1GetHeaders,
  PostV1GetParams,
  PostV1GetResponse,
  PostV1PatchBody,
  PostV1PatchError,
  PostV1PatchHeaders,
  PostV1PatchParams,
  PostV1PatchResponse,
  PostV1PostBody,
  PostV1PostError,
  PostV1PostHeaders,
  PostV1PostResponse,
  UserTimelineCollection,
  UserTimelineModel,
} from "@bubble/common";
import {
  checkInterest,
  createPost,
  getPostById,
  spreadPost,
  updateLike,
  updateSeen,
} from "../../../helpers/db_query";
import { ObjectId } from "mongodb";
import { Post } from "../../../helpers/graph/Post";
import {
  relateUserToPost,
  unrelateUserToPost,
} from "../../../helpers/graph/User";

const serializeInteractionItem = (
  item: InteractionItem
): InteractionItemSerialized => {
  return {
    by: item.by.toHexString(),
    time: item.time.toISOString(),
  };
};

const serializePost = (post: PostModel): PostSerialized => {
  return {
    ...post,
    _id: post._id.toHexString(),
    time_posted: post.time_posted.toISOString(),
    author: post._id.toHexString(),
    part_of: post.part_of.toHexString(),
    like: post.like.map((item) => serializeInteractionItem(item)),
    seen: post.seen.map((item) => serializeInteractionItem(item)),
  };
};

const PostV1Route: FastifyPluginAsync = async (app, opts) => {
  app.get<{
    Headers: PostV1GetHeaders;
    Params: PostV1GetParams;
    Response: PostV1GetResponse;
  }>(
    "/:post_id",
    {
      schema: {
        description: "Get post info by post id",
        tags: ["Post"],
        headers: PostV1GetHeaders,
        params: PostV1GetParams,
        response: {
          200: PostV1GetResponse,
          "4xx": PostV1GetError,
          "5xx": PostV1GetError,
        },
      },
    },
    async (req, res) => {
      // In the future there should be check for auth in case of private post
      // in this version every post is a public post except if it is deleted

      const db = app.mongo.client.db();
      const post = await getPostById(db, req.params.post_id);

      if (post.deleted) {
        return res.code(401).send({
          error: "Post is deleted",
          message: "Cannot get the post as it is deleted",
        });
      }

      return res.code(200).send(serializePost(post));
    }
  );

  app.post<{
    Headers: PostV1PostHeaders;
    Body: PostV1PostBody;
    Response: PostV1PostResponse;
  }>(
    "/",
    {
      schema: {
        description: "Creates new post",
        tags: ["Post"],
        headers: PostV1PostHeaders,
        body: PostV1PostBody,
        response: {
          200: PostV1PostResponse,
          "4xx": PostV1PostError,
          "5xx": PostV1PostError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist || !req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      if (!checkInterest(db, req.body.part_of)) {
        return res.code(400).send({
          error: "Interest Page Unknown",
          message: "Unknown interest page id",
        });
      }

      const result = await createPost(db, {
        ...req.body,
        part_of: new ObjectId(req.body.part_of),
        author: req.user_account?._id!,
      });

      const post_id = result._id.toHexString();
      spreadPost(db, post_id, req.body.part_of);

      const post_in_graph = await Post.createOne({
        id: post_id,
        deleted: result.deleted,
      });

      await Promise.all([
        post_in_graph.relateTo({
          alias: "PostedByUser",
          where: {
            id: post_id,
          },
        }),
        post_in_graph.relateTo({
          alias: "PartOfInterest",
          where: {
            id: req.body.part_of,
          },
        }),
      ]);

      return res.code(200).send(serializePost(result));
    }
  );

  app.patch<{
    Headers: PostV1PatchHeaders;
    Params: PostV1PatchParams;
    Body: PostV1PatchBody;
    Response: PostV1PatchResponse;
  }>(
    "/:post_id",
    {
      schema: {
        description:
          "Change state of a post, currently only allows delete action",
        tags: ["Post"],
        headers: PostV1PatchHeaders,
        params: PostV1PatchParams,
        body: PostV1PatchBody,
        response: {
          200: PostV1PatchResponse,
          "4xx": PostV1PatchError,
          "5xx": PostV1PatchError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist || !req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      const post = await db
        .collection<PostModel>(PostCollection)
        .findOne({ _id: new ObjectId(req.params.post_id) });

      if (post === null) {
        return res.code(400).send({
          error: "Post unknown",
          message: "Post id not found",
        });
      }

      if (
        req.user_status.moderator ||
        (req.user_account?._id === post.author && !post.deleted)
      ) {
        await Promise.all([
          db
            .collection<PostModel>(PostCollection)
            .updateOne(
              { _id: new ObjectId(req.params.post_id) },
              { deleted: req.body.deleted }
            ),
          Post.update(
            { deleted: req.body.deleted },
            {
              where: {
                id: req.params.post_id,
              },
            }
          ),
        ]);

        return res
          .code(200)
          .send({ ...serializePost(post), deleted: req.body.deleted });
      }

      return res.code(401).send(Error401Default);
    }
  );

  app.post<{
    Headers: PostActionV1PostHeaders;
    Params: PostActionV1PostParams;
    Response: PostActionV1PostResponse;
  }>(
    "/:action/:post_id",
    {
      schema: {
        description:
          "As user either like, unlike, and seen this particular post id",
        tags: ["User", "Post"],
        headers: PostActionV1PostHeaders,
        params: PostActionV1PostParams,
        response: {
          200: PostActionV1PostResponse,
          "4xx": PostActionV1PostError,
          "5xx": PostActionV1PostError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist || !req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();

      const timeline = await db
        .collection<UserTimelineModel>(UserTimelineCollection)
        .findOne(
          {
            _id: req.user_account?._id!,
            "timeline.post_id": new ObjectId(req.params.post_id),
          },
          { projection: { timeline: 1 } }
        );

      if (timeline === null) {
        return res.code(400).send({
          error: "Unknown post",
          message: "The post are not in your timeline",
        });
      }

      const timelineItem = timeline.timeline[0];

      let workers: Promise<void>[] = [];
      switch (req.params.action) {
        case PostActionV1Actions.like:
          workers.push(
            updateLike(db, req.user_account?._id!, req.params.post_id, true)
          );
          workers.push(
            relateUserToPost(
              req.user_account?._id.toHexString()!,
              req.params.post_id
            )
          );

          timelineItem.liked = true;

          await Promise.all(workers);
          break;

        case PostActionV1Actions.unlike:
          workers.push(
            updateLike(db, req.user_account?._id!, req.params.post_id, false)
          );
          workers.push(
            unrelateUserToPost(
              req.user_account?._id.toHexString()!,
              req.params.post_id
            )
          );

          timelineItem.liked = false;

          await Promise.all(workers);
          break;

        case PostActionV1Actions.seen:
          if (timelineItem.seen) {
            return res.code(400).send({
              error: "Already seen",
              message: "The post is already seen by the user",
            });
          }

          await updateSeen(db, req.user_account?._id!, req.params.post_id);

          timelineItem.seen = true;

          break;
      }

      return res.code(200).send(timelineItem);
    }
  );

  return;
};

export default PostV1Route;
