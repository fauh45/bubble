import {
  ModelFactory,
  ModelRelatedNodesI,
  NeogmaInstance,
  QueryBuilder,
  QueryRunner,
} from "neogma";
import logger from "../logger";
import { neogma } from "./index";
import { Interest, InterestInstance } from "./Interest";
import type { Post, PostInstance } from "./Post";

export type UserProperties = {
  id: string;
  username: string;
};

export interface UserRelatedNodes {
  LikesInterest: ModelRelatedNodesI<typeof Interest, InterestInstance>;
  InteractWithPost: ModelRelatedNodesI<typeof Post, PostInstance>;
}

export type UserInstance = NeogmaInstance<UserProperties, UserRelatedNodes>;

export const User = ModelFactory<UserProperties, UserRelatedNodes>(
  {
    label: "User",
    primaryKeyField: "id",
    schema: {
      id: {
        type: "string",
        allowEmpty: false,
        uniqueItems: true,
      },
      username: {
        type: "string",
      },
    },
    relationships: {
      LikesInterest: {
        model: Interest,
        direction: "out",
        name: "LIKES",
      },
    },
  },
  neogma
);

export const relateUserToInterest = async (
  user_id: string,
  interest_id: string
) => {
  await User.relateTo({
    alias: "LikesInterest",
    where: {
      source: {
        id: user_id,
      },
      target: {
        id: interest_id,
      },
    },
  });
};

export const relateUserToInterestMany = async (
  user_id: string,
  interest_ids: string[]
) => {
  const worker: Promise<void>[] = [];

  interest_ids.forEach((id) => {
    worker.push(relateUserToInterest(user_id, id));
  });

  await Promise.all(worker);
};

export const relateUserToPost = async (user_id: string, post_id: string) => {
  await User.relateTo({
    alias: "InteractWithPost",
    where: {
      source: {
        id: user_id,
      },
      target: {
        id: post_id,
      },
    },
  });
};

export const unrelateUserToPost = async (user_id: string, post_id: string) => {
  const queryRunner = new QueryRunner({
    driver: neogma.driver,
  });

  await queryRunner.run(
    `MATCH (s:User {id:$user_id})-[r:INTERACT_WITH]->(t:Post {id:$post_id}) DELETE r`,
    {
      post_id: post_id,
      user_id: user_id,
    }
  );
};
