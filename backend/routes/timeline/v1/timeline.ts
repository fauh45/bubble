import { FastifyPluginAsync } from "fastify";
import {
  Error401Default,
  TimelineItem,
  TimelineItemSerialized,
  TimelineV1GetError,
  TimelineV1GetHeaders,
  TimelineV1GetResponse,
  UserTimelineModel,
  UserTimelineSerialized,
} from "@bubble/common";
import { getTimelineById } from "../../../helpers/db_query";

const serializeTimelineItem = (item: TimelineItem): TimelineItemSerialized => {
  return {
    ...item,
    post_id: item.post_id.toHexString(),
  };
};

const serializeTimeline = (
  timeline: UserTimelineModel
): UserTimelineSerialized => {
  return {
    _id: timeline._id.toHexString(),
    timeline: timeline.timeline.map((item) => serializeTimelineItem(item)),
  };
};

const TimelineV1Route: FastifyPluginAsync = async (app, opts) => {
  app.get<{
    Headers: TimelineV1GetHeaders;
    Response: TimelineV1GetResponse;
  }>(
    "/",
    {
      schema: {
        description: "Getting user timeline data",
        tags: ["User"],
        headers: TimelineV1GetHeaders,
        response: {
          200: TimelineV1GetResponse,
          "4xx": TimelineV1GetError,
          "5xx": TimelineV1GetError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist || !req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      const timeline = await getTimelineById(db, req.user?.uid!);

      return res.code(200).send(serializeTimeline(timeline));
    }
  );

  return;
};

export default TimelineV1Route;
