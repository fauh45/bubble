import { ModelFactory, ModelRelatedNodesI, NeogmaInstance } from "neogma";
import { neogma } from ".";
import { Interest, InterestInstance } from "./Interest";
import { User, UserInstance } from "./User";

export type PostProperties = {
  id: string;
  deleted: boolean;
};

export interface PostRelatedNodes {
  PostedByUser: ModelRelatedNodesI<typeof User, UserInstance>;
  PartOfInterest: ModelRelatedNodesI<typeof Interest, InterestInstance>;
}

export type PostInstance = NeogmaInstance<PostProperties, PostRelatedNodes>;

export const Post = ModelFactory<PostProperties, PostRelatedNodes>(
  {
    label: "Post",
    primaryKeyField: "id",
    schema: {
      id: {
        type: "string",
        allowEmpty: false,
        uniqueItems: true,
      },
      deleted: {
        type: "boolean",
      },
    },
    relationships: {
      PostedByUser: {
        model: User,
        direction: "out",
        name: "POSTED_BY",
      },
      PartOfInterest: {
        model: Interest,
        direction: "out",
        name: "PART_OF",
      },
    },
  },
  neogma
);
