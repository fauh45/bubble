import { Static, Type } from "@sinclair/typebox";
import { CommonError } from "../../errors";
import { AuthorizationHeader } from "../../headers";
import { InterestSerialized, UserAccountSerialized } from "../../models";

/* GET "/interest/v1/:interest_id" */
export const InterestV1GetHeaders = Type.Partial(AuthorizationHeader);
export type InterestV1GetHeaders = Static<typeof InterestV1GetHeaders>;

export const InterestV1GetParams = Type.Object({
  interest_id: Type.String(),
});
export type InterestV1GetParams = Static<typeof InterestV1GetParams>;

export const InterestV1GetResponse = InterestSerialized;
export type InterestV1GetResponse = InterestSerialized;

export const InterestV1GetError = CommonError;
export type InterestV1GetError = CommonError;

/* GET "/interest/v1/random/:n" */
export const InterestRandomV1GetHeaders = InterestV1GetHeaders;
export type InterestRandomV1GetHeaders = InterestV1GetHeaders;

export const InterestRandomV1GetParams = Type.Object({
  n: Type.Number({ minimum: 1, maximum: 5, default: 5 }),
});
export type InterestRandomV1GetParams = Static<
  typeof InterestRandomV1GetParams
>;

export const InterestRandomV1GetResponse = Type.Array(InterestSerialized);
export type InterestRandomV1GetResponse = Static<
  typeof InterestRandomV1GetResponse
>;

export const InterestRandomV1GetError = CommonError;
export type InterestRandomV1GetError = CommonError;

/* POST "/interest/v1/" */
export const InterestV1PostHeaders = AuthorizationHeader;
export type InterestV1PostHeaders = AuthorizationHeader;

export const InterestV1PostBody = Type.Pick(InterestSerialized, [
  "_id",
  "name",
  "description",
]);
export type InterestV1PostBody = Static<typeof InterestV1PostBody>;

export const InterestV1PostResponse = InterestSerialized;
export type InterestV1PostResponse = InterestSerialized;

export const InterestV1PostError = CommonError;
export type InterestV1PostError = CommonError;

/* POST "/interest/v1/:action/:interest_id" */
export const InterestActionV1PostHeaders = AuthorizationHeader;
export type InterestActionV1PostHeaders = AuthorizationHeader;

export enum InterestActionV1Actions {
  follow = "follow",
  unfollow = "unfollow",
}
export const InterestActionV1PostParams = Type.Object({
  action: Type.Enum(InterestActionV1Actions),
  interest_id: Type.String(),
});
export type InterestActionV1PostParams = Static<
  typeof InterestActionV1PostParams
>;

export const InterestActionV1PostResponse = UserAccountSerialized;
export type InterestActionV1PostResponse = UserAccountSerialized;

export const InterestActionV1PostError = CommonError;
export type InterestActionV1PostError = CommonError;

/* POST "/interest/v1/search/" */
export const InterestSearchV1PostHeaders = InterestV1GetHeaders;
export type InterestSearchV1PostHeaders = InterestV1GetHeaders;

export const InterestSearchV1PostBody = Type.Object({
  query: Type.String(),
});
export type InterestSearchV1PostBody = Static<typeof InterestSearchV1PostBody>;

export const InterestSearchV1PostResponse = Type.Array(InterestSerialized);
export type InterestSearchV1PostResponse = Static<
  typeof InterestSearchV1PostResponse
>;

export const InterestSearchV1PostError = CommonError;
export type InterestSearchV1PostError = CommonError;
