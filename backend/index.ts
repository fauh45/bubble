import "dotenv/config";

import fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifySwagger from "fastify-swagger";
import firebaseAdmin from "firebase-admin";
import fastifyMongodb from "fastify-mongodb";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert("./serviceAccount.json"),
});

import logger from "./helpers/logger";
import "./helpers/graph";
import { UserStatus } from "./middleware/decode_auth";
import { getUserById } from "./helpers/db_query";

import TestV1Route from "./routes/test/v1/test";
import UserV1Route from "./routes/user/v1/user";
import TimelineV1Route from "./routes/timeline/v1/timeline";
import PostV1Route from "./routes/post/v1/post";

const app = fastify({
  logger: logger,
});

// Hook are here because it did not register on the plugin somehow
app.addHook("preHandler", async (req, rep) => {
  const user_status: UserStatus = {
    exist: false,
    token_valid: false,
    email_verified: false,
    moderator: false,
  };

  if (req.headers.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      req.user = decodedToken;

      user_status.token_valid = true;

      const { email_verified } = decodedToken;
      const user = await getUserById(app.mongo.db!, req.user.uid);

      user_status.exist = true;
      user_status.email_verified =
        email_verified !== undefined && email_verified;
      user_status.moderator = user.is_moderator;

      req.user_account = user;
    } catch (error) {
      user_status.exist = false;
      user_status.email_verified = false;
      user_status.moderator = false;
      app.log.info(error, "User not found");
    }
  }

  req.user_status = user_status;
  return;
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
    tags: [
      { name: "User", description: "User related endpoints" },
      { name: "Interest", description: "Interest page related endpoints" },
      { name: "Post", description: "Post related endpoints" },
      { name: "Abuse", description: "Content reporting related endpoints" },
    ],
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});
app.register(fastifyCors, { origin: "*" });
app.register(fastifyMongodb, {
  forceClose: true,
  url: process.env.MONGODB_URI!,
});

/**
 * v1 Routes
 */
app.register(UserV1Route, { prefix: "/user/v1" });
app.register(TestV1Route, { prefix: "/test/v1" });
app.register(TimelineV1Route, { prefix: "/timeline/v1" });
app.register(PostV1Route, { prefix: "/post/v1" });

app.listen(3000).catch((err) => {
  logger.error(err, "Error");
});
