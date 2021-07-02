import { Static, Type } from "@sinclair/typebox";
import { CommonError } from "../../errors";
import { AuthorizationHeader } from "../../headers";
import { AbuseSerialized } from "../../models";

/* GET "/abuse/v1/:post_id" */
export const AbuseV1GetHeaders = AuthorizationHeader;
export type AbuseV1GetHeaders = AuthorizationHeader;

export const AbuseV1GetParams = Type.Object({
  post_id: Type.String(),
});
export type AbuseV1GetParams = Static<typeof AbuseV1GetParams>;

export const AbuseV1GetResponse = AbuseSerialized;
export type AbuseV1GetResponse = AbuseSerialized;

export const AbuseV1GetError = CommonError;
export type AbuseV1GetError = CommonError;

/* GET "abuse/v1/list?max=n" */
export const AbuseListV1GetHeaders = AuthorizationHeader;
export type AbuseListV1GetHeaders = AuthorizationHeader;

export const AbuseListV1GetQueryString = Type.Object({
  max: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 15 })),
  last_id: Type.Optional(Type.String()),
});
export type AbuseListV1GetQueryString = Static<
  typeof AbuseListV1GetQueryString
>;

export const AbuseListV1GetResponse = Type.Array(AbuseSerialized, {
  minItems: 1,
  maxItems: 50,
});
export type AbuseListV1GetResponse = Static<typeof AbuseListV1GetResponse>;

export const AbuseListV1GetError = CommonError;
export type AbuseListV1GetError = CommonError;

/* POST "abuse/v1/:post_id" */
export const AbuseV1PostHeaders = AuthorizationHeader;
export type AbuseV1PostHeaders = AuthorizationHeader;

export const AbuseV1PostParams = AbuseV1GetParams;
export type AbuseV1PostParams = AbuseV1GetParams;

export const AbuseV1PostBody = Type.Object({
  reason: Type.String({ minLength: 15 }),
});
export type AbuseV1PostBody = Static<typeof AbuseV1PostBody>;

export const AbuseV1PostResponse = Type.Object({
  ok: Type.Boolean(),
});
export type AbuseV1PostResponse = Static<typeof AbuseV1PostResponse>;

export const AbuseV1PostError = CommonError;
export type AbuseV1PostError = CommonError;
