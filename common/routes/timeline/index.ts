import { CommonError } from "../../errors";
import { AuthorizationHeader } from "../../headers";
import { UserTimelineSerialized } from "../../models";

/* GET "/timeline/v1/" */
export const TimelineV1GetHeaders = AuthorizationHeader;
export type TimelineV1GetHeaders = AuthorizationHeader;

export const TimelineV1GetResponse = UserTimelineSerialized;
export type TimelineV1GetResponse = UserTimelineSerialized;

export const TimelineV1GetError = CommonError;
export type TimelineV1GetError = CommonError;
