import { Type, Static } from "@sinclair/typebox";
import { CommonError } from "../../errors";
import { AuthorizationHeader } from "../../headers";
import { UserAccountSerialized } from "../../models";

const UserAccountSerializedEmailOmited = Type.Omit(UserAccountSerialized, [
  "email",
]);

/* GET "user/v1/:user_id" */
export const UserV1GetHeaders = AuthorizationHeader;
export type UserV1GetHeaders = AuthorizationHeader;

export const UserV1GetParams = Type.Object({ user_id: Type.String() });
export type UserV1GetParams = Static<typeof UserV1GetParams>;

export const UserV1GetResponse = Type.Intersect([
  UserAccountSerializedEmailOmited,
  Type.Object({ email: Type.Optional(Type.String()) }),
]);
export type UserV1GetResponse = Static<typeof UserV1GetResponse>;

export const UserV1GetError = CommonError;
export type UserV1GetError = CommonError;

/* POST "user/v1/" */
export const UserV1PostHeaders = AuthorizationHeader;
export type UserV1PostHeaders = AuthorizationHeader;

export const UserV1PostBody = Type.Intersect([
  Type.Pick(UserAccountSerialized, ["username", "name", "bio"]),
  Type.Object({
    likes: Type.Array(Type.String(), { minItems: 3, maxItems: 5 }),
  }),
]);
export type UserV1PostBody = Static<typeof UserV1PostBody>;

export const UserV1PostResponse = UserAccountSerialized;
export type UserV1PostResponse = UserAccountSerialized;

export const UserV1PostError = CommonError;
export type UserV1PostError = CommonError;

/* GET "user/v1/check-username/:username" */
export const UsernameCheckV1GetHeaders = Type.Partial(AuthorizationHeader);
export type UsernameCheckV1GetHeaders = Static<
  typeof UsernameCheckV1GetHeaders
>;

export const UsernameCheckV1GetParams = Type.Object({
  username: Type.String(),
});
export type UsernameCheckV1GetParams = Static<typeof UsernameCheckV1GetParams>;

export const UsernameCheckV1GetResponse = Type.Object({
  available: Type.Boolean(),
});
export type UsernameCheckV1GetResponse = Static<
  typeof UsernameCheckV1GetResponse
>;

export const UsernameCheckV1GetError = CommonError;
export type UsernameCheckV1GetError = CommonError;
