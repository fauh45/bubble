import "dotenv/config";

import Redis from "ioredis";
import cron from "node-cron";
import { QueryRunner } from "neogma";

import fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifySwagger from "fastify-swagger";
import firebaseAdmin from "firebase-admin";
import fastifyMongodb from "fastify-mongodb";
import fastifyRateLimit from "fastify-rate-limit";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert("./serviceAccount.json"),
});

import logger from "./helpers/logger";
import { neogma } from "./helpers/graph";
import { UserStatus } from "./middleware/decode_auth";
import { addTimelineItem, getUserById } from "./helpers/db_query";
import { getRecommendation } from "./helpers/recommendation";
import {
  getCurrentOnlineUserKey,
  getCurrentRecomendedUserKey,
  TimelineItemType,
  TimeWindowMs,
} from "@bubble/common";

import TestV1Route from "./routes/test/v1/test";
import UserV1Route from "./routes/user/v1/user";
import TimelineV1Route from "./routes/timeline/v1/timeline";
import PostV1Route from "./routes/post/v1/post";
import AbuseV1Route from "./routes/abuse/v1/abuse";
import InterestV1Route from "./routes/interest/v1/interest";

const app = fastify({
  logger: logger,
  trustProxy: process.env.NODE_ENV === "production",
});
const redis = new Redis({
  host: process.env.REDIS_URI!,
  connectTimeout: 500,
  maxRetriesPerRequest: 1,
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

      const db = app.mongo.client.db();
      const user = await getUserById(db, decodedToken.uid);

      user_status.exist = true;
      user_status.email_verified = email_verified || false;
      user_status.moderator = user.is_moderator;

      const key = getCurrentOnlineUserKey();
      redis
        .multi()
        .sadd(key, [user._id])
        .pexpire(key, TimeWindowMs * 2)
        .exec();

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
    // In production it would be https, but http here to make sure swagger
    // can accessed the server correctly
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});
app
  .register(fastifyRateLimit, {
    max: 60,
    timeWindow: 1000 * 20,
    redis: redis,
    keyGenerator: (req) =>
      req.user?.uid ||
      req.headers["x-real-ip"]?.toString() ||
      req.headers["x-client-ip"]?.toString() ||
      req.ip,
  })
  .then(() => {
    app.setNotFoundHandler(
      {
        preHandler: app.rateLimit({
          max: 5,
          timeWindow: 5000,
        }),
      },
      (req, res) => {
        return res.code(404).send({
          error: "Not Found",
          message: "Route not found",
        });
      }
    );
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
app.register(InterestV1Route, { prefix: "/interest/v1" });
app.register(AbuseV1Route, { prefix: "/abuse/v1" });

app.ready((err) => {
  if (err) throw err;

  cron.schedule("30 */7 * * * *", async () => {
    app.log.info("Giving last 15 minutes active user recommendation");

    const activeUserKey = getCurrentOnlineUserKey();
    const activeUserRecommendedKey = getCurrentRecomendedUserKey();
    app.log.info(activeUserKey, "Active user key");

    const activeUser = await redis.smembers(activeUserKey);
    app.log.info(activeUser, "Active user are");

    let i = 0;
    for (const user in activeUser) {
      app.log.info("Getting Recommendation for " + user);

      const isMember = await redis.sismember(
        activeUserRecommendedKey,
        activeUser[user]
      );
      app.log.info(activeUser[user] + " are member : " + isMember);

      if (isMember) {
        app.log.info(activeUser[user] + " are already handled");

        continue;
      }

      const result = await redis
        .multi()
        .sadd(activeUserRecommendedKey, [activeUser[user]])
        .pexpire(activeUserRecommendedKey, TimeWindowMs * 2)
        .exec();
      app.log.info(result, "Result of redis multi");

      try {
        const queryRunner = new QueryRunner({
          driver: neogma.driver,
        });

        const recommendPostId = await getRecommendation(
          queryRunner,
          activeUser[user]
        );

        if (recommendPostId !== undefined) {
          const db = app.mongo.client.db();

          app.log.info("Putting " + recommendPostId);
          await addTimelineItem(
            db,
            user,
            recommendPostId,
            TimelineItemType.recommended
          );
        }
      } catch (err) {
        app.log.error(err);

        await redis.srem(activeUserRecommendedKey, activeUser[user]);
      }
    }
  });
});

app.listen(3000).catch((err) => {
  logger.error(err, "Error");
});
