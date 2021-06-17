import { fastify } from "fastify";
import fastifyCors from "fastify-cors";
import fastifySwagger from "fastify-swagger";

import logger from "./helpers/logger";
import TestV1Route from "./test/v1/test";

const app = fastify({
  logger: logger,
});

app.register(fastifySwagger, {
  routePrefix: "/docs",
  exposeRoute: process.env.NODE_ENV !== "production",
  swagger: {
    info: {
      title: "Bubble Backend",
      description: "Bubble Backend Services",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});
app.register(fastifyCors, { origin: "*" });

app.register(TestV1Route, { prefix: "/test/v1" });
app.listen(3000).catch((err) => logger.error(err, "Error"));
