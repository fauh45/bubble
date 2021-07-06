import {
  InterestRandomV1GetResponse,
  InterestSearchV1PostBody,
  InterestSearchV1PostResponse,
  InterestV1GetResponse,
  PostV1GetResponse,
  TestV1GetResponse,
  TimelineV1GetResponse,
  UsernameCheckV1GetResponse,
  UserV1GetResponse,
} from "@bubble/common";
import axios from "axios";
import firebase from "firebase";
import "firebase/auth";
import { commonPost } from "./mutation";

const apiUrl = process.env.REACT_APP_BACKEND!;

export const commonGet = async <Response>(route: string): Promise<Response> => {
  const userToken = await firebase.auth().currentUser?.getIdToken();
  const response = await axios.get<Response>(apiUrl + route, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  return response.data;
};

export const getUserTimeline = () => {
  return commonGet<TimelineV1GetResponse>("/timeline/v1/");
};

export const getPost = (post_id: string) => {
  return commonGet<PostV1GetResponse>(`/post/v1/${post_id}`);
};

export const getUser = (user_id: string) => {
  return commonGet<UserV1GetResponse>(`/user/v1/${user_id}`);
};

export const checkUsername = (username: string) => {
  return commonGet<UsernameCheckV1GetResponse>(
    `/user/v1/check-username/${username}`
  );
};

export const checkUserAuthStatus = () => {
  return commonGet<TestV1GetResponse>("/test/v1/");
};

export const getInterest = (interest_id: string) => {
  return commonGet<InterestV1GetResponse>(`/interest/v1/${interest_id}`);
};

export const getRandomInterest = (n: number) => {
  return commonGet<InterestRandomV1GetResponse>(`/interest/v1/random/${n}`);
};

export const searchInterest = (query: string) => {
  return commonPost<InterestSearchV1PostBody, InterestSearchV1PostResponse>(
    "/interest/v1/search",
    { query: query }
  );
};
