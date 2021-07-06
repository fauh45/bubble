import { FastifyPluginAsync } from "fastify";
import { ObjectId } from "mongodb";
import {
  Error401Default,
  UserAccountCollection,
  UserAccountModel,
  UsernameCheckV1GetError,
  UsernameCheckV1GetHeaders,
  UsernameCheckV1GetParams,
  UsernameCheckV1GetResponse,
  UserV1GetError,
  UserV1GetHeaders,
  UserV1GetParams,
  UserV1GetResponse,
  UserV1PatchBody,
  UserV1PatchError,
  UserV1PatchHeaders,
  UserV1PatchParams,
  UserV1PatchResponse,
  UserV1PostBody,
  UserV1PostError,
  UserV1PostHeaders,
  UserV1PostResponse,
} from "@bubble/common";
import {
  checkInterestMany,
  checkUsername,
  createUser,
  createUserTimeline,
  getUserById,
} from "../../../helpers/db_query";
import { relateUserToInterestMany, User } from "../../../helpers/graph/User";

const serializeUser = (user: UserAccountModel): UserV1GetResponse => {
  return {
    ...user,
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
        tags: ["User"],
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
        const user = serializeUser(await getUserById(db, req.params.user_id));

        if (user._id !== req.user_account?._id) {
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
        tags: ["User"],
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

      if (!(await checkInterestMany(db, req.body.likes))) {
        return res.code(400).send({
          error: "Interest Error",
          message: "The interest you have inputted are wrong",
        });
      }

      const new_user: UserAccountModel = {
        _id: req.user?.uid!,
        bio: req.body.bio,
        email: req.user?.email!,
        is_moderator: false,
        likes: req.body.likes,
        name: req.body.name,
        onboarding: false,
        username: req.body.username,
      };

      await Promise.all([
        createUser(db, new_user),
        createUserTimeline(db, req.user?.uid!),
        User.createOne({ id: req.user?.uid!, username: req.body.username }),
      ]);

      relateUserToInterestMany(req.user?.uid!, req.body.likes);
      return res.code(200).send(serializeUser(new_user));
    }
  );

  app.patch<{
    Headers: UserV1PatchHeaders;
    Params: UserV1PatchParams;
    Body: UserV1PatchBody;
    Response: UserV1PatchResponse;
  }>(
    "/:user_id",
    {
      schema: {
        description:
          "Patch user data by user_id. 'is_moderator' are only able to be changed by other moderators, while the rest of the data can only be replaced by their own user. Trying to change data not own by user WILL NOT have error emitted.",
        tags: ["User"],
        headers: UserV1PatchHeaders,
        params: UserV1PatchParams,
        body: UserV1PatchBody,
        response: {
          200: UserV1PatchResponse,
          "4xx": UserV1PatchError,
          "5xx": UserV1PatchError,
        },
      },
    },
    async (req, res) => {
      const { user_status, body, params } = req;

      if (!user_status.token_valid || !user_status.exist) {
        return res.code(401).send(Error401Default);
      }

      const { is_moderator, ...user_self_update } = body;

      const db = app.mongo.client.db();
      let user_update: Partial<UserAccountModel> = {};

      if (user_status.exist && user_status.token_valid) {
        user_update = { ...user_self_update };
      }

      if (user_status.exist && user_status.moderator) {
        user_update.is_moderator = is_moderator;
      }

      if (user_update !== {})
        await db
          .collection<UserAccountModel>(UserAccountCollection)
          .updateOne({ _id: params.user_id }, user_update);

      const updated_user = { ...req.user_account, ...user_update };
      return res.code(200).send(updated_user);
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
        tags: ["User"],
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
