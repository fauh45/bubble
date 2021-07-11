import {
  AbuseV1PostBody,
  AbuseV1PostResponse,
  InterestActionV1Actions,
  InterestActionV1PostResponse,
  InterestV1PostBody,
  InterestV1PostResponse,
  PostActionV1Actions,
  PostActionV1PostResponse,
  PostV1PatchBody,
  PostV1PatchResponse,
  PostV1PostBody,
  PostV1PostResponse,
  UserV1PostBody,
  UserV1PostResponse,
} from "@bubble/common";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";

const apiUrl = process.env.REACT_APP_BACKEND!;

export const commonPost = async <Body, Response>(
  route: string,
  body: Body
): Promise<Response> => {
  const userToken = await firebase.auth().currentUser?.getIdToken();
  const response = await axios.post<Response>(apiUrl + route, body, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  return response.data;
};

export const commonPatch = async <Body, Response>(
  route: string,
  body: Body
): Promise<Response> => {
  const userToken = await firebase.auth().currentUser?.getIdToken();
  const response = await axios.patch<Response>(apiUrl + route, body, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  return response.data;
};

export const createNewUser = (body: UserV1PostBody) => {
  return commonPost<UserV1PostBody, UserV1PostResponse>("/user/v1/", body);
};

export const createNewPost = (body: PostV1PostBody) => {
  return commonPost<PostV1PostBody, PostV1PostResponse>("/post/v1/", body);
};

export const postAction = (action: PostActionV1Actions, post_id: string) => {
  return commonPost<{}, PostActionV1PostResponse>(
    `/post/v1/${action}/${post_id}`,
    {}
  );
};

export const interestAction = (
  action: InterestActionV1Actions,
  interest_id: string
) => {
  return commonPost<{}, InterestActionV1PostResponse>(
    `/interest/v1/${action}/${interest_id}`,
    {}
  );
};

export const createInterest = (body: InterestV1PostBody) => {
  return commonPost<InterestV1PostBody, InterestV1PostResponse>(
    `/interest/v1/`,
    body
  );
};

export const createReport = (post_id: string, body: AbuseV1PostBody) => {
  return commonPost<AbuseV1PostBody, AbuseV1PostResponse>(
    `/abuse/v1/${post_id}`,
    body
  );
};

export const pathcPost = (post_id: string, body: PostV1PatchBody) => {
  return commonPatch<PostV1PatchBody, PostV1PatchResponse>(
    `/post/v1/${post_id}`,
    body
  );
};
