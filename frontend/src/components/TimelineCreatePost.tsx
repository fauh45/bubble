import React from "react";
import { Box, Button, Select, TextArea } from "grommet";
import { useQuery } from "react-query";
import { searchInterest } from "../api/query";
import { InterestSearchV1PostResponse } from "@bubble/common/build";

const TimelineCreatePost: React.FC = (props) => {
  const [query, setQuery] = React.useState("");
  const [interestValue, setInterestValue] =
    React.useState<InterestSearchV1PostResponse>();
  const searchQuery = useQuery(
    ["interestQuery", query],
    () => searchInterest(query),
    {
      enabled: Boolean(query),
    }
  );
  return (
    <Box
      direction="column"
      width="800px"
      background={{ color: "white" }}
      pad="24px"
      gap="24px"
    >
      {/* TODO: Use formik in here */}
      <Box flex="grow" height={{ max: "400px" }}>
        <TextArea
          size="small"
          fill={true}
          resize="vertical"
          placeholder="What's up today"
        />
      </Box>

      <Box direction="row" justify="end" gap="16px">
        <Select
          clear
          size="small"
          searchPlaceholder="Search interest.."
          onSearch={(text) => setQuery(text)}
          plain
          placeholder="Where to post"
          options={searchQuery.isLoading ? [] : searchQuery.data!}
          emptySearchMessage={
            searchQuery.isLoading
              ? "Loading..."
              : query.length === 0
              ? "Search for some interest"
              : "Nothing found"
          }
          labelKey={"name"}
          value={interestValue}
          onChange={({ option }) => setInterestValue(option)}
        />
        <Button primary label="Post" />
      </Box>
    </Box>
  );
};

export default TimelineCreatePost;
