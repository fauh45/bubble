import "dotenv/config";

import { neogma } from "../helpers/graph";
import { Interest } from "../helpers/graph/Interest";
import { Post } from "../helpers/graph/Post";
import { User } from "../helpers/graph/User";

const testNeo4J = async () => {
  const user_1 = await User.createOne({
    id: "1",
    username: "1",
  });

  const user_2 = await User.createOne({
    id: "2",
    username: "2",
  });

  const interest = await Interest.createOne({
    id: "int",
    name: "int",
  });

  const post = await Post.createOne({
    id: "1",
    deleted: false,
  });

  await Post.relateTo({
    alias: "PartOfInterest",
    where: {
      source: {
        id: "1",
      },
      target: {
        id: "int",
      },
    },
  });

  await Post.relateTo({
    alias: "PostedByUser",
    where: {
      source: {
        id: "1",
      },
      target: {
        id: "1",
      },
    },
  });

  await User.relateTo({
    alias: "LikesInterest",
    where: {
      source: {
        id: "1",
      },
      target: {
        id: "int",
      },
    },
  });

  await User.relateTo({
    alias: "InteractWithPost",
    where: {
      source: {
        id: "2",
      },
      target: {
        id: "1",
      },
    },
  });

  console.log(user_1);
  console.log(user_2);
  console.log(interest);
  console.log(post);

  await user_1.delete({ detach: true });
  await user_2.delete({ detach: true });
  await interest.delete({ detach: true });
  await post.delete({ detach: true });

  await neogma.driver.close();
};

testNeo4J()
  .then(() => console.log("Done"))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
