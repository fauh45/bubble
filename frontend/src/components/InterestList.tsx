import React from "react";
import { Box, Text } from "grommet";
import InterestItem from "../components/InterestItem";
import { useQuery } from "react-query";
import { getRandomInterest } from "../api/query";

interface Props {
  handleChoice(interest_id: string, checked: boolean): void;
}

const InterestList: React.FC<Props> = (props) => {
  const { status, data } = useQuery(
    "randomInterest",
    () => getRandomInterest(5),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const handleChoice = (interest_id: string, checked: boolean) => {
    props.handleChoice(interest_id, checked);
  };

  return (
    <Box align="start" fill="horizontal" gap="48px" direction="row-responsive">
      {status === "loading" && <Text>Loading...</Text>}
      {status === "error" && <Text>Got an error...</Text>}
      {status === "success" &&
        data?.map((item) => {
          return (
            <InterestItem
              name={item.name}
              id={item._id}
              handleChoice={handleChoice}
            />
          );
        })}
    </Box>
  );
};

export default InterestList;
