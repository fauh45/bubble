import React from "react";
import { Redirect, RouteComponentProps } from "@reach/router";
import { Box, Text } from "grommet";
import Page from "../components/Page";
import TimelineItem from "../components/TimelineItem";
import TimelineCreatePost from "../components/TimelineCreatePost";
import { useQuery } from "react-query";
import { checkUserAuthStatus, getUserTimeline } from "../api/query";

interface Props extends RouteComponentProps {}

const Timeline: React.FC<Props> = (props) => {
  const { data: userAuthStatus } = useQuery("userStatus", checkUserAuthStatus);

  const { status, data, error } = useQuery("timeline", getUserTimeline, {
    staleTime: 1000 * 60 * 60,
    enabled: !!userAuthStatus?.exist,
  });

  if (!userAuthStatus?.exist && userAuthStatus?.token_valid) {
    return <Redirect to="/onboarding" noThrow />;
  }

  return (
    <Page>
      <Box
        fill="horizontal"
        background={{ color: "#f8dac8" }}
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
              <TimelineItem key={item.post_id} post_id={item.post_id} />;
            })
          : null}
      </Box>
    </Page>
  );
};

export default Timeline;
