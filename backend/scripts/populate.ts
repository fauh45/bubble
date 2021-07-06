import "dotenv/config";

import { InterestSerialized } from "@bubble/common";
import { createInterest } from "../helpers/db_query";
import { mongoClient } from "../helpers/mongo";
import { Interest } from "../helpers/graph/Interest";

const interests: Pick<InterestSerialized, "_id" | "description" | "name">[] = [
  {
    _id: "r",
    name: "Random",
    description: "Random interest, post anything here!",
  },
  {
    _id: "sp",
    name: "Sports!",
    description: "Interest all about sports! Go Sports!",
  },
  {
    _id: "ftb",
    name: "Football (Sports)",
    description: "Post about your sports interest here!",
  },
  {
    _id: "game",
    name: "Games",
    description: "All about games, post your epic gamer moments!",
  },
  {
    _id: "bubble",
    name: "Bubble Social",
    description: "The official interest page for this website",
  },
  {
    _id: "polban",
    name: "Politeknik Negeri Bandung",
    description: "The interest page for POLBAN",
  },
  {
    _id: "jtk",
    name: "JTK (POLBAN)",
    description: "Share your JTK (part of POLBAN) interest here!",
  },
  {
    _id: "suggest",
    name: "Suggestion",
    description: "Show your suggestion or request for this platform here",
  },
];

const populateDb = async () => {
  const args = process.argv.slice(2);

  const client = await mongoClient.connect();
  const db = client.db();

  const worker: Promise<any>[] = [];
  interests.map((interest) => {
    worker.push(createInterest(db, interest));

    if (!(args.length > 0 && args[0] === "--noNeo")) {
      worker.push(
        Interest.createOne({ id: interest._id, name: interest.name })
      );
    }
  });

  await Promise.all(worker);
};

populateDb()
  .then(() => console.log("Success"))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
