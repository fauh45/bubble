import "dotenv/config";
import { mongoClient } from "../helpers/mongo";

const makeCollection = async () => {
  const client = await mongoClient.connect();
  const db = await client.db();

  await db.createCollection("user_account");
  await db.createCollection("user_timeline");
  await db.createCollection("post");
  await db.createCollection("interest_page");
  await db.createCollection("abuse");

  await db.collection("user_timeline").createIndex({ "timeline.post_id": 1 });
  await db.collection("interest_page").createIndex({ name: "text" });
  await db
    .collection("user_account")
    .createIndex({ username: "text" }, { unique: true });
  await db.collection("abuse").createIndex({ reportee: 1 });
};

makeCollection()
  .then(() => console.log("Done"))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
