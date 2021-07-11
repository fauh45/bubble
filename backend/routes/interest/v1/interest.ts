import { FastifyPluginAsync } from "fastify";
import {
  Error401Default,
  InterestActionV1Actions,
  InterestActionV1PostError,
  InterestActionV1PostHeaders,
  InterestActionV1PostParams,
  InterestActionV1PostResponse,
  InterestModel,
  InterestRandomV1GetError,
  InterestRandomV1GetHeaders,
  InterestRandomV1GetParams,
  InterestRandomV1GetResponse,
  InterestSearchV1PostBody,
  InterestSearchV1PostError,
  InterestSearchV1PostHeaders,
  InterestSearchV1PostResponse,
  InterestSerialized,
  InterestV1GetError,
  InterestV1GetHeaders,
  InterestV1GetParams,
  InterestV1GetResponse,
  InterestV1PostBody,
  InterestV1PostError,
  InterestV1PostHeaders,
  InterestV1PostResponse,
} from "@bubble/common";
import {
  addInterestFollower,
  addUserInterest,
  checkInterest,
  createInterest,
  getInterest,
  getRandomInterest,
  getUserById,
  removeInterestFollower,
  removeUserInterest,
  searchInterest,
} from "../../../helpers/db_query";
import { Interest } from "../../../helpers/graph/Interest";

const serializeInterest = (interest: InterestModel): InterestSerialized => {
  return {
    ...interest,
    followers: interest.followers.map((id) => id),
    posts: interest.posts.map((id) => id.toHexString()),
  };
};

const serializeInterestMany = (
  interests: InterestModel[]
): InterestSerialized[] => {
  return interests.map((interest) => serializeInterest(interest));
};

const InterestV1Route: FastifyPluginAsync = async (app, opts) => {
  app.get<{
    Headers: InterestV1GetHeaders;
    Params: InterestV1GetParams;
    Response: InterestV1GetParams;
  }>(
    "/:interest_id",
    {
      schema: {
        description: "Get info from interest id (same as the route)",
        tags: ["Interest"],
        headers: InterestV1GetHeaders,
        params: InterestV1GetParams,
        response: {
          200: InterestV1GetResponse,
          "4xx": InterestV1GetError,
          "5xx": InterestV1GetError,
        },
      },
    },
    async (req, res) => {
      // In the future on checking for private interest page
      // do it here, for now it is all public
      const db = app.mongo.client.db();
      const interest = await getInterest(db, req.params.interest_id);

      return res.code(200).send(serializeInterest(interest));
    }
  );

  app.get<{
    Headers: InterestRandomV1GetHeaders;
    Params: InterestRandomV1GetParams;
    Response: InterestRandomV1GetResponse;
  }>(
    "/random/:n",
    {
      schema: {
        description: "Get n random interest page",
        tags: ["Interest"],
        headers: InterestRandomV1GetHeaders,
        params: InterestRandomV1GetParams,
        response: {
          200: InterestRandomV1GetResponse,
          "4xx": InterestRandomV1GetError,
          "5xx": InterestRandomV1GetError,
        },
      },
    },
    async (req, res) => {
      // On private interest page, needs more checking
      const db = app.mongo.client.db();
      const randomInterests = await getRandomInterest(db, req.params.n);

      return res.code(200).send(serializeInterestMany(randomInterests));
    }
  );

  app.post<{
    Headers: InterestV1PostHeaders;
    Body: InterestV1PostBody;
    Response: InterestV1PostResponse;
  }>(
    "/",
    {
      schema: {
        description:
          "Create a new interest page (moderator only), `_id` with the value of `random` could result in error",
        tags: ["Interest"],
        headers: InterestV1PostHeaders,
        body: InterestV1PostBody,
        response: {
          200: InterestV1PostResponse,
          "4xx": InterestV1PostError,
          "5xx": InterestV1PostError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.moderator) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();

      const newInterest = await Promise.all([
        Interest.createOne({ id: req.body._id, name: req.body.name }),
        createInterest(db, req.body),
      ]);

      return res.code(200).send(serializeInterest(newInterest[1]));
    }
  );

  app.post<{
    Headers: InterestActionV1PostHeaders;
    Params: InterestActionV1PostParams;
    Response: InterestActionV1PostResponse;
  }>(
    "/:action/:interest_id",
    {
      schema: {
        description: "Action for interest for user to follow and unfollow",
        tags: ["Interest"],
        headers: InterestActionV1PostHeaders,
        params: InterestActionV1PostParams,
        response: {
          200: InterestActionV1PostResponse,
          "4xx": InterestActionV1PostError,
          "5xx": InterestActionV1PostError,
        },
      },
    },
    async (req, res) => {
      if (!req.user_status.exist || !req.user_status.token_valid) {
        return res.code(401).send(Error401Default);
      }

      const db = app.mongo.client.db();
      if (!(await checkInterest(db, req.params.interest_id))) {
        return res.code(400).send({
          error: "Interest Error",
          message: "The interest you have inputted are invalid",
        });
      }

      const user = await getUserById(db, req.user_account?._id!);

      switch (req.params.action) {
        case InterestActionV1Actions.follow:
          if (user.likes.includes(req.params.interest_id)) {
            return res.code(400).send({
              error: "Interest Error",
              message: "You have already followed this interest",
            });
          }

          await Promise.all([
            addInterestFollower(
              db,
              req.user_account?._id!,
              req.params.interest_id
            ),
            addUserInterest(db, req.user_account?._id!, req.params.interest_id),
          ]);

          user.likes.push(req.params.interest_id);

          return res.code(200).send({ ...user, likes: user.likes });

        case InterestActionV1Actions.unfollow:
          if (!user.likes.includes(req.params.interest_id)) {
            return res.code(400).send({
              error: "Interest Error",
              message: "You have not followed this interest",
            });
          }

          await Promise.all([
            removeInterestFollower(
              db,
              req.user_account?._id!,
              req.params.interest_id
            ),
            removeUserInterest(
              db,
              req.user_account?._id!,
              req.params.interest_id
            ),
          ]);

          return res.code(200).send({
            ...user,
            likes: user.likes.filter((val) => val !== req.params.interest_id),
          });
      }
    }
  );

  app.post<{
    Headers: InterestSearchV1PostHeaders;
    Body: InterestSearchV1PostBody;
    Response: InterestSearchV1PostResponse;
  }>(
    "/search",
    {
      schema: {
        description:
          "Search for interest using a string, result limited to 100 records",
        tags: ["Interest"],
        headers: InterestSearchV1PostHeaders,
        body: InterestSearchV1PostBody,
        response: {
          200: InterestSearchV1PostResponse,
          "4xx": InterestSearchV1PostError,
          "5xx": InterestSearchV1PostError,
        },
      },
    },
    async (req, res) => {
      const db = app.mongo.client.db();
      const searchResults = await searchInterest(db, req.body.query);

      return res.code(200).send(serializeInterestMany(searchResults));
    }
  );

  return;
};

export default InterestV1Route;
