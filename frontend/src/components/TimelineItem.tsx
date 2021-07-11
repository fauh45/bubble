import React, { useContext } from "react";
import { Box, Button, Menu, Text } from "grommet";
import { More, Flag, Trash, User, Like } from "grommet-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TimeAgo from "timeago-react";
import {
  checkUserAuthStatus,
  getInterest,
  getPost,
  getUser,
} from "../api/query";
import {
  PostActionV1Actions,
  PostActionV1PostResponse,
  PostV1GetError,
  PostV1GetResponse,
  TimelineItemSerialized,
  TimelineItemType,
  UserV1GetError,
  UserV1GetResponse,
} from "@bubble/common";
import { postAction } from "../api/mutation";
import ColorHash from "color-hash";
import { UserContext } from "../context/user";
import { Link } from "@reach/router";

interface TimelineItemProps extends TimelineItemSerialized {
  disableSeen?: boolean;
  isVisible: boolean;
  handleAction(post_id: string, new_data: PostActionV1PostResponse): void;
}

const TimelineItem: React.FC<TimelineItemProps> = (props) => {
  const user = useContext(UserContext);

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
      enabled: !!postData?.author && !!user,
    }
  );

  const { data: userAuthStatus } = useQuery("userStatus", checkUserAuthStatus, {
    staleTime: 1000 * 60 * 60,
  });

  const queryClient = useQueryClient();

  const { status: interestStatus, data: interestData } = useQuery(
    ["interest", postData?.part_of!],
    () => getInterest(postData?.part_of!),
    {
      staleTime: 1000 * 10,
      enabled: !!postData?.part_of,
    }
  );

  const seenAction = useMutation(
    () => postAction(PostActionV1Actions.seen, props.post_id),
    {
      onSuccess: (data) => {
        props.handleAction(props.post_id, data);

        queryClient.invalidateQueries(["post", props.post_id]);
      },
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

  const colorHash = new ColorHash({
    hue: [
      { min: 30, max: 90 },
      { min: 180, max: 210 },
      { min: 270, max: 285 },
    ],
    lightness: 0.5,
  });
  const userNameColor: string = userData?.username || postData?.author || "";

  if (
    user &&
    props.isVisible &&
    !props.seen &&
    !(seenAction.isLoading || seenAction.isSuccess)
  ) {
    seenAction.mutateAsync();
  }

  return (
    <Box
      background={{ color: { light: "#FFFFFF", dark: "#333333" } }}
      border={{ color: "#E6E6E6" }}
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
            gap="16px"
            margin={{ bottom: "8px" }}
          >
            <Box fill="vertical" align="end" justify="end">
              <Box
                round="full"
                height="24px"
                overflow="hidden"
                width="24px"
                background={{ color: colorHash.hex(userNameColor) }}
                align="center"
                justify="end"
              >
                <User size="16px" />
              </Box>
            </Box>
            {!user && (
              <Box align="start">
                <Text color={{ light: "#aaaaaa", dark: "#99999" }}>
                  A Bubble User
                </Text>
              </Box>
            )}
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
                <TimeAgo datetime={postData?.time_posted!} />
              </Text>
            </Box>
            <Box>
              <Text color={{ light: "#666666", dark: "#99999" }} size="xsmall">
                From{" "}
                {postData ? (
                  <Link to={"/i/" + postData.part_of}>
                    <b>{postData.part_of}</b> (
                    {interestStatus === "success" && interestData?.name})
                  </Link>
                ) : (
                  "Loading..."
                )}
              </Text>
            </Box>
            {props.type === TimelineItemType.recommended && (
              <Box>
                <Text
                  color={{ light: "#666666", dark: "#99999" }}
                  size="xsmall"
                >
                  We think you might like this
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box fill="vertical" align="start">
          {!!user && (
            <Menu
              dropProps={{
                align: { top: "bottom", right: "right" },
                elevation: "medium",
              }}
              icon={<More size="18px" />}
              items={[
                {
                  disabled: !user || props.reported,
                  label: <Text margin={{ right: "16px" }}>Report</Text>,
                  onClick: () => {},
                  icon: (
                    <Box
                      fill="vertical"
                      pad={{ left: "8px", right: "16px", vertical: "8px" }}
                    >
                      <Flag size="small" />
                    </Box>
                  ),
                },
                {
                  disabled:
                    !user ||
                    !userAuthStatus ||
                    !postData ||
                    !(postData.author === user.uid || userAuthStatus.moderator),
                  label: (
                    <Text color="red" margin={{ right: "16px" }}>
                      Delete
                    </Text>
                  ),
                  onClick: () => {},
                  icon: (
                    <Box
                      fill="vertical"
                      pad={{ left: "8px", right: "16px", vertical: "8px" }}
                    >
                      <Trash size="small" color="red" />
                    </Box>
                  ),
                },
              ]}
            />
          )}
        </Box>
      </Box>
      {/* The content */}
      <Box wrap={true}>
        {postStatus === "loading" && <Text>Loading...</Text>}
        {postStatus === "success" && <Text>{postData?.content}</Text>}
        {postStatus === "error" && (
          <Text color="status-error">{postError?.message}</Text>
        )}
      </Box>
      {/* Interact section */}
      <Box direction="row">
        <Button
          icon={<Like color={props.liked ? "brand" : "plain"} size="18px" />}
          onClick={() =>
            props.liked ? unlikeAction.mutate() : likeAction.mutate()
          }
          disabled={!user || likeAction.isLoading || unlikeAction.isLoading}
        />
        <Box justify="center">
          <Text size="small">
            {postStatus === "loading" ? 0 : postData?.like_aggregate}{" "}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

TimelineItem.defaultProps = {
  disableSeen: false,
};

export default TimelineItem;
