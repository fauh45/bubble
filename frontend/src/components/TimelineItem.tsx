import React from "react";
import { Box, Button, Text } from "grommet";
import { Flag, Like } from "grommet-icons";
import { useQuery } from "react-query";
import { getPost, getUser } from "../api/query";
import {
  PostV1GetError,
  PostV1GetResponse,
  UserV1GetError,
  UserV1GetResponse,
} from "@bubble/common";

type TimelineItemProps = {
  post_id: string;
};

const TimelineItem: React.FC<TimelineItemProps> = (props) => {
  const {
    status: postStatus,
    data: postData,
    error: postError,
  } = useQuery<PostV1GetResponse, PostV1GetError>(["post", props.post_id], () =>
    getPost(props.post_id)
  );
  const {
    status: userStatus,
    data: userData,
    error: userError,
  } = useQuery<UserV1GetResponse, UserV1GetError>(
    ["user", postData?.author!],
    () => getUser(postData?.author!),
    {
      enabled: !!postData?.author,
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
                {Date()}
              </Text>
            </Box>
            <Box>
              <Text color={{ light: "#666666", dark: "#99999" }} size="xsmall">
                From
              </Text>
            </Box>
          </Box>
        </Box>
        <Box fill="vertical" align="start">
          <Button icon={<Flag size="18px" />} />
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
        <Button icon={<Like size="18px" />} />
        <Box justify="center">
          <Text size="small">
            {postStatus === "loading" ? 0 : postData?.like_aggregate}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineItem;
