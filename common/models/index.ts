import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "mongodb";

export const UserAccountCollection = "user_account";
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

export const UserTimelineCollection = "user_timeline";
export interface TimelineItem {
  seen: boolean;
  liked: boolean;
  post_id: ObjectId;
}
export interface UserTimelineModel {
  _id: ObjectId;
  timeline: TimelineItem[];
  recommended: TimelineItem[];
}

export const TimelineItemSerialized = Type.Object({
  seen: Type.Boolean(),
  liked: Type.Boolean(),
  post_id: Type.String(),
});
export type TimelineItemSerialized = Static<typeof TimelineItemSerialized>;
export const UserTimelineSerialized = Type.Object({
  _id: Type.String(),
  timeline: Type.Array(TimelineItemSerialized),
  recommended: Type.Array(TimelineItemSerialized),
});
export type UserTimelineSerialized = Static<typeof UserTimelineSerialized>;

export const PostCollection = "post";
export interface InteractionItem {
  by: ObjectId;
  time: string;
}
export interface PostModel {
  _id: ObjectId;
  time_posted: string;
  deleted: boolean;
  author: ObjectId;
  part_of: ObjectId;
  content: string;
  media: string;
  like_aggregate: number;
  like: InteractionItem[];
  seen_aggregate: number;
  seen: InteractionItem[];
}

export const InteractionItemSerialized = Type.Object({
  by: Type.String(),
  time: Type.String(),
});
export type InteractionItemSerialized = Static<
  typeof InteractionItemSerialized
>;
export const PostSerialized = Type.Object({
  _id: Type.String(),
  time_posted: Type.String(),
  deleted: Type.Boolean(),
  author: Type.String(),
  part_of: Type.String(),
  content: Type.String({ minLength: 1, maxLength: 560 }),
  media: Type.String(),
  like_aggregate: Type.Number(),
  like: Type.Array(InteractionItemSerialized),
  seen_aggregate: Type.Number(),
  seen: Type.Array(InteractionItemSerialized),
});
export type PostSerialized = Static<typeof PostSerialized>;

export const InterestCollection = "interest_page";
export interface InterestModel {
  _id: ObjectId;
  name: string;
  followers_aggregate: number;
  followers: ObjectId[];
  posts: ObjectId[];
}

export const InterestSerialized = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  followers_aggregate: Type.String(),
  followers: Type.Array(Type.String()),
  posts: Type.Array(Type.String()),
});
export type InterestSerialized = Static<typeof InterestSerialized>;

export const AbuseCollection = "abuse";
export interface AbuseModel {
  _id: ObjectId;
  reason: string[];
  reportee: ObjectId[];
}

export const AbuseSerialized = Type.Object({
  _id: Type.String(),
  reason: Type.Array(Type.String()),
  reportee: Type.Array(Type.String()),
});
