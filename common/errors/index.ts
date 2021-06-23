import { Static, Type } from "@sinclair/typebox";

export const CommonError = Type.Object({
  error: Type.String(),
  message: Type.String(),
});
export type CommonError = Static<typeof CommonError>;

export const Error401Default: CommonError = {
  error: "Not Authorized",
  message: "You are not authorized to use this API",
};

export const Error500Default: CommonError = {
  error: "Server Error",
  message: "There are problem handling your request, please try again",
};
