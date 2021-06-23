import { FastifyPluginAsync } from "fastify";
import { ObjectId } from "mongodb";
import {
  Error401Default,
  UsernameCheckV1GetError,
  UsernameCheckV1GetHeaders,
  UsernameCheckV1GetParams,
  UsernameCheckV1GetResponse,
  UserV1GetError,
  UserV1GetHeaders,
  UserV1GetParams,
  UserV1GetResponse,
  UserV1PostBody,
  UserV1PostError,
  UserV1PostHeaders,
  UserV1PostResponse,
} from "@bubble/common";
import {
  checkInterest,
  checkInterestMany,
  checkUsername,
  createUser,
  getUserById,
  UserAccountModel,
} from "../../helpers/db_query";
import { relateUserToInterestMany, User } from "../../helpers/graph/User";

const serialized_user = (user: UserAccountModel): UserV1GetResponse => {
  return {
    ...user,
    _id: user._id.toHexString(),
    likes: user.likes.map((like) => like.toHexString()),
  };
};

const UserV1Route: FastifyPluginAsync = async (app, opts) => {
  app.get<{
    Headers: UserV1GetHeaders;
    Response: UserV1GetResponse;
    Params: UserV1GetParams;
  }>(
    "/:user_id",
    {
      schema: {
        description: "Get user id information",
        headers: UserV1GetHeaders,
        params: UserV1GetParams,
        response: {
          200: UserV1GetResponse,
          "4xx": UserV1GetError,
          "5xx": UserV1GetError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist) return res.code(401).send(Error401Default);
      const db = app.mongo.client.db();

      try {
        const user = serialized_user(await getUserById(db, req.params.user_id));

        if (user._id !== req.user_account?._id.toHexString()) {
          delete user.email;
        }

        return res.code(200).send(user);
      } catch (error) {
        return res.code(400).send({
          error: error.message,
          message: error.message,
        });
      }
    }
  );

  app.post<{
    Headers: UserV1PostHeaders;
    Body: UserV1PostBody;
    Response: UserV1PostResponse;
  }>(
    "/",
    {
      schema: {
        description: "Creates new user for user that has done social login",
        headers: UserV1PostHeaders,
        body: UserV1PostBody,
        response: {
          200: UserV1PostResponse,
          "4xx": UserV1PostError,
          "5xx": UserV1PostError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      if (req.user_status.exist) {
        return res.code(400).send({
          error: "Already Registered",
          message: "User have been registered",
        });
      }

      const db = app.mongo.client.db();

      /* WARNING : Could be slow */
      if (await checkUsername(db, req.body.username)) {
        return res.code(400).send({
          error: "Username Exist",
          message: "Username need to be unique",
        });
      }

      if (await checkInterestMany(db, req.body.likes)) {
        return res.code(400).send({
          error: "Username Exist",
          message: "Username need to be unique",
        });
      }

      const new_user: UserAccountModel = {
        _id: new ObjectId(req.user?.uid!),
        bio: req.body.bio,
        email: req.user?.email!,
        is_moderator: false,
        likes: req.body.likes.map((like) => new ObjectId(like)),
        name: req.body.name,
        onboarding: false,
        username: req.body.username,
      };

      await Promise.all([
        createUser(db, new_user),
        User.createOne({ id: req.user?.uid!, username: req.body.username }),
      ]);

      relateUserToInterestMany(req.user?.uid!, req.body.likes);
      return res.code(200).send(serialized_user(new_user));
    }
  );

  app.get<{
    Headers: UsernameCheckV1GetHeaders;
    Params: UsernameCheckV1GetParams;
    Response: UsernameCheckV1GetResponse;
  }>(
    "/check-username/:username",
    {
      schema: {
        description: "Check if username already in use",
        headers: UsernameCheckV1GetHeaders,
        params: UsernameCheckV1GetParams,
        response: {
          200: UsernameCheckV1GetResponse,
          "4xx": UsernameCheckV1GetError,
          "5xx": UsernameCheckV1GetError,
        },
      },
    },
    async (req, res) => {
      const db = app.mongo.client.db();
      return res
        .code(200)
        .send({ available: checkUsername(db, req.params.username) });
    }
  );

  return;
};

export default UserV1Route;
