import { Static, Type } from "@sinclair/typebox";
import { CommonError } from "../../errors";
import { AuthorizationHeader } from "../../headers";
import { PostSerialized, TimelineItemSerialized } from "../../models";

/* GET "/post/v1/:post_id" */
export const PostV1GetHeaders = Type.Partial(AuthorizationHeader);
export type PostV1GetHeaders = Static<typeof PostV1GetHeaders>;

export const PostV1GetParams = Type.Object({
  post_id: Type.String(),
});
export type PostV1GetParams = Static<typeof PostV1GetParams>;

export const PostV1GetResponse = PostSerialized;
export type PostV1GetResponse = PostSerialized;

export const PostV1GetError = CommonError;
export type PostV1GetError = CommonError;

/* POST "/post/v1/" */
export const PostV1PostHeaders = AuthorizationHeader;
export type PostV1PostHeaders = AuthorizationHeader;

export const PostV1PostBody = Type.Pick(PostSerialized, [
  "content",
  "media",
  "part_of",
]);
export type PostV1PostBody = Static<typeof PostV1PostBody>;

export const PostV1PostResponse = PostSerialized;
export type PostV1PostResponse = PostSerialized;

export const PostV1PostError = CommonError;
export type PostV1PostError = CommonError;

/* PATCH "/post/v1/:post_id" */
export const PostV1PatchHeaders = AuthorizationHeader;
export type PostV1PatchHeaders = AuthorizationHeader;

export const PostV1PatchParams = PostV1GetParams;
export type PostV1PatchParams = PostV1GetParams;

export const PostV1PatchBody = Type.Optional(
  Type.Pick(PostSerialized, ["deleted"])
);
export type PostV1PatchBody = Static<typeof PostV1PatchBody>;

export const PostV1PatchResponse = PostSerialized;
export type PostV1PatchResponse = PostSerialized;

export const PostV1PatchError = CommonError;
export type PostV1PatchError = CommonError;

/* POST "/post/v1/:action/:post_id" */
export const PostActionV1PostHeaders = AuthorizationHeader;
export type PostActionV1PostHeaders = AuthorizationHeader;

export enum PostActionV1Actions {
  like = "like",
  unlike = "unlike",
  seen = "seen",
}

export const PostActionV1PostParams = Type.Intersect([
  PostV1GetParams,
  Type.Object({ action: Type.Enum(PostActionV1Actions) }),
]);
export type PostActionV1PostParams = Static<typeof PostActionV1PostParams>;

export const PostActionV1PostResponse = TimelineItemSerialized;
export type PostActionV1PostResponse = TimelineItemSerialized;

export const PostActionV1PostError = CommonError;
export type PostActionV1PostError = CommonError;
