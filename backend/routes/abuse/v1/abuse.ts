import { FastifyPluginAsync } from "fastify";
import {
  AbuseListV1GetError,
  AbuseListV1GetHeaders,
  AbuseListV1GetQueryString,
  AbuseListV1GetResponse,
  AbuseV1GetError,
  AbuseV1GetHeaders,
  AbuseV1GetParams,
  AbuseV1GetResponse,
  AbuseV1PostBody,
  AbuseV1PostError,
  AbuseV1PostHeaders,
  AbuseV1PostParams,
  AbuseV1PostResponse,
  Error401Default,
} from "@bubble/common";
import {
  getAbuseById,
  getManyAbuse,
  updateAbuse,
  updateUserReportTimeline,
} from "../../../helpers/db_query";

const AbuseV1Route: FastifyPluginAsync = async (app, opts) => {
  app.get<{
    Headers: AbuseV1GetHeaders;
    Params: AbuseV1GetParams;
  }>(
    "/:post_id",
    {
      schema: {
        description: "Get particular abuse from a post id",
        tags: ["Abuse"],
        headers: AbuseV1GetHeaders,
        params: AbuseV1GetParams,
        response: {
          200: AbuseV1GetResponse,
          "4xx": AbuseV1GetError,
          "5xx": AbuseV1GetError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.moderator) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      return await getAbuseById(db, req.params.post_id);
    }
  );

  app.get<{
    Headers: AbuseListV1GetHeaders;
    Querystring: AbuseListV1GetQueryString;
  }>(
    "/list",
    {
      schema: {
        description: "Get list of newly update reports of post",
        tags: ["Abuse"],
        headers: AbuseListV1GetHeaders,
        querystring: AbuseListV1GetQueryString,
        response: {
          200: AbuseListV1GetResponse,
          "4xx": AbuseListV1GetError,
          "5xx": AbuseListV1GetError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.moderator) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      return await getManyAbuse(db, req.query.max || 15, req.query.last_id);
    }
  );

  app.post<{
    Headers: AbuseV1PostHeaders;
    Params: AbuseV1PostParams;
    Body: AbuseV1PostBody;
  }>(
    "/:post_id",
    {
      schema: {
        description: "Post a new report, will not report error",
        tags: ["Abuse"],
        headers: AbuseV1PostHeaders,
        params: AbuseV1PostParams,
        body: AbuseV1PostBody,
        response: {
          200: AbuseV1PostResponse,
          "4xx": AbuseV1PostError,
          "5xx": AbuseV1PostError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist || !req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      await Promise.all([
        updateAbuse(
          db,
          req.params.post_id,
          req.user_account?._id!,
          req.body.reason
        ),
        updateUserReportTimeline(
          db,
          req.params.post_id,
          req.user_account?._id!
        ),
      ]);

      return res.code(200).send({ ok: true });
    }
  );

  return;
};

export default AbuseV1Route;
