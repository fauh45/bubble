import { Static, Type } from "@sinclair/typebox";

export const AuthorizationHeader = Type.Object({
  Authorization: Type.String(),
});
export type AuthorizationHeader = Static<typeof AuthorizationHeader>;
