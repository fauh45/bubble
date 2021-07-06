import React from "react";
import { Box, Button, Text } from "grommet";
import { Flag, Like } from "grommet-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getInterest, getPost, getUser } from "../api/query";
import {
  PostActionV1Actions,
  PostActionV1PostResponse,
  PostV1GetError,
  PostV1GetResponse,
  TimelineItemSerialized,
  UserV1GetError,
  UserV1GetResponse,
} from "@bubble/common";
import { postAction } from "../api/mutation";

interface TimelineItemProps extends TimelineItemSerialized {
  handleAction(post_id: string, new_data: PostActionV1PostResponse): void;
}

const TimelineItem: React.FC<TimelineItemProps> = (props) => {
  const {
    status: postStatus,
    data: postData,
    error: postError,
  } = useQuery<PostV1GetResponse, PostV1GetError>(
    ["post", props.post_id],
    () => getPost(props.post_id),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const {
    status: userStatus,
    data: userData,
    error: userError,
  } = useQuery<UserV1GetResponse, UserV1GetError>(
    ["user", postData?.author!],
    () => getUser(postData?.author!),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!postData?.author,
    }
  );

  const queryClient = useQueryClient();

  const { status: interestStatus, data: interestData } = useQuery(
    ["interest", postData?.part_of!],
    () => getInterest(postData?.part_of!),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!postData?.part_of,
    }
  );

  const likeAction = useMutation(
    () => postAction(PostActionV1Actions.like, props.post_id),
    {
      onSuccess: (data) => {
        props.handleAction(props.post_id, data);

        queryClient.invalidateQueries(["post", props.post_id]);
      },
    }
  );
  const unlikeAction = useMutation(
    () => postAction(PostActionV1Actions.unlike, props.post_id),
    {
      onSuccess: (data) => {
        props.handleAction(props.post_id, data);

        queryClient.invalidateQueries(["post", props.post_id]);
      },
    }
  );

  return (
    <Box
      background={{ color: { light: "#fff", dark: "333" } }}
      width="800px"
      pad={{ vertical: "16px", horizontal: "24px" }}
      direction="column"
      gap="16px"
    >
      {/* User ID */}
      <Box direction="row" justify="between">
        <Box direction="column">
          <Box
            align="start"
            justify="start"
            direction="row"
            gap="24px"
            margin={{ bottom: "8px" }}
          >
            <Box>
              <img
                height="20px"
                width="20px"
                src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
                alt="new"
              />
            </Box>
            {postStatus === "loading" ||
              (userStatus === "loading" && <Box align="start">Loading...</Box>)}
            {userStatus === "success" && (
              <Box align="start">{userData?.username}</Box>
            )}
            {userStatus === "error" && (
              <Box align="start">Error: {userError?.message}</Box>
            )}
          </Box>
          <Box direction="row" gap="8px">
            <Box>
              <Text color={{ light: "#aaaaaa", dark: "#99999" }} size="xsmall">
                {new Date(postData?.time_posted!).toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text color={{ light: "#666666", dark: "#99999" }} size="xsmall">
                From <b>{postData?.part_of}</b> (
                {interestStatus === "success" && interestData?.name})
              </Text>
            </Box>
          </Box>
        </Box>
        <Box fill="vertical" align="start">
          <Button icon={<Flag size="18px" />} disabled />
        </Box>
      </Box>
      {/* The content */}
      <Box wrap={true}>
        {postStatus === "loading" && <Text>Loading...</Text>}
        {postStatus === "success" && <Text>{postData?.content}</Text>}
        {postStatus === "error" && <Text>{postError?.message}</Text>}
      </Box>
      {/* Interact section */}
      <Box direction="row">
        <Button
          icon={<Like color={props.liked ? "brand" : "plain"} size="18px" />}
          onClick={() =>
            props.liked ? unlikeAction.mutate() : likeAction.mutate()
          }
          disabled={likeAction.isLoading || unlikeAction.isLoading}
        />
        <Box justify="center">
          <Text size="small">
            {postStatus === "loading" ? 0 : postData?.like_aggregate}{" "}
            {props.liked ? "Liked!" : null}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineItem;
