import { Type, Static } from "@sinclair/typebox";
import { CommonError } from "../../errors";
import { AuthorizationHeader } from "../../headers";

export const TestV1Body = Type.Object({
  name: Type.String({
    description: "The Name of the tester in string",
    examples: ["John", "Doe"],
  }),
  age: Type.Optional(
    Type.Integer({
      description: "The age of the tester, could be unknown",
      examples: [1, 35, 150],
      minimum: 1,
      maximum: 150,
    })
  ),
});

export type TestV1Body = Static<typeof TestV1Body>;

export enum TestV1AgeStatus {
  UnderAge = "UnderAge",
  OK = "OK",
}
export const TestV1Response = Type.Object({
  status: Type.Enum(TestV1AgeStatus, {
    description: "Status of the tester determined by the system",
    examples: [TestV1AgeStatus.OK, TestV1AgeStatus.UnderAge],
  }),
});
export type TestV1Response = Static<typeof TestV1Response>;

export const TestV1Error = TestV1Response;
export type TestV1Error = TestV1Response;

/* GET "/test/v1/" */
export const TestV1GetHeaders = Type.Partial(AuthorizationHeader);
export type TestV1GetHeaders = Static<typeof TestV1GetHeaders>;

export const TestV1GetResponse = Type.Object({
  exist: Type.Boolean(),
  token_valid: Type.Boolean(),
  email_verified: Type.Boolean(),
  moderator: Type.Boolean(),
});
export type TestV1GetResponse = Static<typeof TestV1GetResponse>;

export const TestV1GetError = CommonError;
export type TestV1GetError = CommonError;
