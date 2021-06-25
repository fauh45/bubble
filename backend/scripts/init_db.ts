import "dotenv/config";
import {
  AbuseCollection,
  InterestCollection,
  PostCollection,
  UserAccountCollection,
  UserTimelineCollection,
} from "../../common/build";
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
  await db.collection(InterestCollection).createIndex({ name: "text" });
  await db
    .collection(UserAccountCollection)
    .createIndex({ username: "text" }, { unique: true });
  await db.collection(AbuseCollection).createIndex({ reportee: 1 });
};

makeCollection()
  .then(() => console.log("Done"))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
