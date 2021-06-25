import { ModelFactory, NeogmaInstance } from "neogma";
import { neogma } from ".";

export type InterestProperty = {
  id: string;
  name: string;
};

export interface InterestRelatedNodes {}

export type InterestInstance = NeogmaInstance<
  InterestProperty,
  InterestRelatedNodes
>;

export const Interest = ModelFactory<InterestProperty, InterestRelatedNodes>(
  {
    label: "Interest",
    schema: {
      id: {
        type: "string",
        uniqueItems: true,
        allowEmpty: false,
      },
      name: {
        type: "string",
      },
    },
  },
  neogma
);
