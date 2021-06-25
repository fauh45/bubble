import { ModelFactory, ModelRelatedNodesI, NeogmaInstance } from "neogma";
import { neogma } from "./index";
import { Interest, InterestInstance } from "./Interest";

export type UserProperties = {
  id: string;
  username: string;
};

export interface UserRelatedNodes {
  LikesInterest: ModelRelatedNodesI<typeof Interest, InterestInstance>;
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
