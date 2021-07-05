import {
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

export const createNewUser = (body: UserV1PostBody) => {
  return commonPost<UserV1PostBody, UserV1PostResponse>("/user/v1/", body);
};

export const createNewPost = (body: PostV1PostBody) => {
  return commonPost<PostV1PostBody, PostV1PostResponse>("/post/v1/", body);
};