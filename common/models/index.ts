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
export enum TimelineItemType {
  recommended = "recommended",
  followed = "followed",
}
export interface TimelineItem {
  seen: boolean;
  liked: boolean;
  reported: boolean;
  type: TimelineItemType;
  post_id: ObjectId;
}
export interface UserTimelineModel {
  _id: ObjectId;
  timeline: TimelineItem[];
}

export const TimelineItemSerialized = Type.Object({
  seen: Type.Boolean(),
  liked: Type.Boolean(),
  type: Type.Enum(TimelineItemType),
  post_id: Type.String(),
});
export type TimelineItemSerialized = Static<typeof TimelineItemSerialized>;
export const UserTimelineSerialized = Type.Object({
  _id: Type.String(),
  timeline: Type.Array(TimelineItemSerialized),
});
export type UserTimelineSerialized = Static<typeof UserTimelineSerialized>;

export const PostCollection = "post";
export interface InteractionItem {
  by: ObjectId;
  time: Date;
}
export interface PostModel {
  _id: ObjectId;
  time_posted: Date;
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
  _id: string;
  name: string;
  description: string;
  followers_aggregate: number;
  followers: ObjectId[];
  posts: ObjectId[];
}

export const InterestSerialized = Type.Object({
  _id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  followers_aggregate: Type.Number(),
  followers: Type.Array(Type.String()),
  posts: Type.Array(Type.String()),
});
export type InterestSerialized = Static<typeof InterestSerialized>;

export const AbuseCollection = "abuse";
export interface AbuseModel {
  _id: ObjectId;
  last_updated: Date;
  reason: string[];
  reportee: ObjectId[];
}

export const AbuseSerialized = Type.Object({
  _id: Type.String(),
  last_updated: Type.String(),
  reason: Type.Array(Type.String()),
  reportee: Type.Array(Type.String()),
});
export type AbuseSerialized = Static<typeof AbuseSerialized>;
