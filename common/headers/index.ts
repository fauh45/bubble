import { Static, Type } from "@sinclair/typebox";

export const AuthorizationHeader = Type.Required(
  Type.Object({
    Authorization: Type.String(),
  })
);
export type AuthorizationHeader = Static<typeof AuthorizationHeader>;
