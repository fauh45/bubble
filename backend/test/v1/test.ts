import { FastifyPluginAsync } from "fastify";
import {
  TestV1Body,
  TestV1Response,
  TestV1Error,
  TestV1AgeStatus,
} from "@bubble/common";
import logger from "../../helpers/logger";

const TestV1Route: FastifyPluginAsync = async (app, opts) => {
  app.post<{ Body: TestV1Body; Response: TestV1Response }>(
    "/",
    {
      schema: {
        description: "Testing endpoint for the tester",
        body: TestV1Body,
        response: {
          200: TestV1Response,
          401: TestV1Error,
        },
      },
    },
    async (req, res) => {
      logger.info("Requester name : " + req.body.name);
      logger.info("Requester age : " + req.body.age);

      if (req.body.age && req.body.age >= 18) {
        return res.status(200).send({
          status: TestV1AgeStatus.OK,
        });
      }

      return res.status(401).send({
        status: TestV1AgeStatus.UnderAge,
      });
    }
  );

  return;
};

export default TestV1Route;
