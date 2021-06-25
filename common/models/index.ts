import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "mongodb";

export interface UserAccountModel {
  _id: ObjectId;
  name: string;
  is_moderator: boolean;
  username: string;
  email: string;
  bio: string;
  onboarding: boolean;
  likes: ObjectId[];
}

export const UserAccountSerialized = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  is_moderator: Type.Boolean(),
  username: Type.String(),
  email: Type.String(),
  bio: Type.String(),
  onboarding: Type.Boolean(),
  likes: Type.Array(Type.String()),
});
export type UserAccountSerialized = Static<typeof UserAccountSerialized>;
