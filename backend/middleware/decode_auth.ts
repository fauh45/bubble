import { FastifyPluginCallback } from "fastify";
import firebaseAdmin from "firebase-admin";
import { getUserById, UserAccountModel } from "../helpers/db_query";

export interface UserStatus {
  /**
   * Does the user have account in the database
   */
  exist: boolean;
  /**
   * Does user token validated by firebase
   */
  token_valid: boolean;
  /**
   *  Does the user have verified his email
   */
  email_verified: boolean;
  /**
   *  Does the user have verified email used
   */
  moderator: boolean;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: firebaseAdmin.auth.DecodedIdToken;
    user_status: UserStatus;
    user_account?: UserAccountModel;
  }
}
