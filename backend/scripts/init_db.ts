import "dotenv/config";
import {
  AbuseCollection,
  InterestCollection,
  PostCollection,
  UserAccountCollection,
  UserTimelineCollection,
} from "@bubble/common";
import { mongoClient } from "../helpers/mongo";

const makeCollection = async () => {
  const client = await mongoClient.connect();
  const db = await client.db();

  await db.createCollection(UserAccountCollection);
  await db.createCollection(UserTimelineCollection);
  await db.createCollection(PostCollection);
  await db.createCollection(InterestCollection);
  await db.createCollection(AbuseCollection);

  await db
    .collection(UserTimelineCollection)
    .createIndex({ "timeline.post_id": 1 });
  await db.collection(PostCollection).createIndex({ "like.by": 1 });
  await db.collection(PostCollection).createIndex({ "seen.by": 1 });
  await db.collection(InterestCollection).createIndex({ name: "text" });
  await db
    .collection(UserAccountCollection)
    .createIndex({ username: "text" }, { unique: true });
  await db.collection(AbuseCollection).createIndex({ reportee: 1 });
  await db.collection(AbuseCollection).createIndex({ last_updated: -1 });
};

makeCollection()
  .then(() => console.log("Done"))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
