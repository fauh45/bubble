import { navigate, RouteComponentProps } from "@reach/router";
import { Box, InfiniteScroll, Spinner } from "grommet";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { TimelineItemType } from "@bubble/common";
import { getInterest } from "../api/query";
import InterestPageCard from "../components/InterestPageCard";
import Page from "../components/Page";
import TimelineCreatePost from "../components/TimelineCreatePost";
import TimelineItem from "../components/TimelineItem";
import { UserContext } from "../context/user";

interface Props extends RouteComponentProps {
  interestId?: string;
}

const InterestPage = (props: Props): JSX.Element => {
  const user = useContext(UserContext);

  const { status, data, error } = useQuery(
    ["interest", props.interestId!],
    () => getInterest(props.interestId!),
    {
      staleTime: 1000 * 25,
      enabled: !!props.interestId,
    }
  );

  if (!props.interestId || error) {
    navigate("/404");
  }

  return (
    <Page header={true}>
      <Box
        fill="horizontal"
        background={{ color: { light: "#FFFFFF", dark: "#333333" } }}
        direction="column"
        align="center"
      >
        {status === "success" ? (
          <InterestPageCard
            interest_id={props.interestId!}
            name={data?.name!}
            description={data?.description!}
            followers_count={data?.followers_aggregate!}
          />
        ) : (
          <Spinner size="medium" />
        )}

        {user && status === "success" && <TimelineCreatePost interest={data} />}

        {status === "success" &&
          !!data?.posts.length &&
          data?.posts.length > 0 && (
            <InfiniteScroll items={data.posts} step={10}>
              {(item: string) => (
                <TimelineItem
                  key={item}
                  disableSeen={true}
                  isVisible={false}
                  liked={false}
                  post_id={item}
                  reported={false}
                  seen={false}
                  type={TimelineItemType.followed}
                  handleAction={(_p, _d) => { }}
                />
              )}
            </InfiniteScroll>
          )}

        <Box align="center" background="white" width="800px">
          .
        </Box>
      </Box>
    </Page>
  );
};

export default InterestPage;
