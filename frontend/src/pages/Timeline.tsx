import React from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { Box, Text } from "grommet";
import Page from "../components/Page";
import TimelineItem from "../components/TimelineItem";
import TimelineCreatePost from "../components/TimelineCreatePost";
import { useQuery, useQueryClient } from "react-query";
import { checkUserAuthStatus, getUserTimeline } from "../api/query";
import { PostActionV1PostResponse } from "../../../common/build";

interface Props extends RouteComponentProps {}

const Timeline: React.FC<Props> = (props) => {
  const { data: userAuthStatus } = useQuery("userStatus", checkUserAuthStatus, {
    staleTime: 1000 * 60 * 60,
  });

  const { status, data } = useQuery("timeline", getUserTimeline, {
    staleTime: 1000 * 10,
    enabled: !!userAuthStatus?.exist,
  });

  if (!userAuthStatus?.exist && userAuthStatus?.token_valid) {
    navigate("/onboarding");
  }

  const queryClient = useQueryClient();

  const handlePostAction = (
    post_id: string,
    new_data: PostActionV1PostResponse
  ) => {
    const newTimeline = data?.timeline.map((item) =>
      item.post_id === post_id ? { ...new_data } : item
    );

    queryClient.setQueryData("timeline", () => {
      return { ...data, timeline: newTimeline };
    });
  };

  return (
    <Page header={true}>
        <Box
          fill="horizontal"
          background={{ color: {light:'#FFFFFF', dark:'#333333'}}}
          direction="column"
          align="center"
        >
          <TimelineCreatePost />
          {status === "loading" ||
            (status === "idle" && <Text>Loading timeline...</Text>)}
          {status === "success" &&
          data?.timeline.length &&
          data?.timeline.length > 0
            ? data.timeline.map((item) => {
                return (
                  <TimelineItem
                    key={item.post_id}
                    handleAction={handlePostAction}
                    {...item}
                  />
                );
              })
            : null}
            <Box
              align='center'
              background='white'
              width='800px'
            >
              .
            </Box>
        </Box>
    </Page>
  );
};

export default Timeline;
