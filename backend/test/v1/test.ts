import { FastifyPluginAsync } from "fastify";
import {
  TestV1Body,
  TestV1Response,
  TestV1Error,
  TestV1AgeStatus,
  AuthorizationHeader,
} from "@bubble/common";

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
      app.log.info("Requester name : " + req.body.name);
      app.log.info("Requester age : " + req.body.age);

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

  app.get(
    "/",
    {
      schema: {
        description: "Test your auth status",
        headers: AuthorizationHeader,
      },
    },
    async (req, res) => {
      app.log.info("User status");
      app.log.info(req.user_status);
      return res.status(200).send(req.user_status);
    }
  );
  return;
};

export default TestV1Route;
