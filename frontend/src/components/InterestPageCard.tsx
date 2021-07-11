import React, { useContext } from "react";
import { Box, Button, Heading, Text } from "grommet";
import { Add, Checkmark } from "grommet-icons";

import ColorHash from "color-hash";
import { UserContext } from "../context/user";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUser } from "../api/query";
import { interestAction } from "../api/mutation";
import { InterestActionV1Actions } from "@bubble/common";

interface InterestPageCardProps {
  interest_id: string;
  name: string;
  description: string;
}

const InterestPageCard: React.FC<InterestPageCardProps> = (props) => {
  const user = useContext(UserContext);

  const queryClient = useQueryClient();

  const { status, data } = useQuery(
    ["user", user?.uid!],
    () => getUser(user?.uid!),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!user,
    }
  );

  const isFollowed = () => {
    return status === "success" && data?.likes.includes(props.interest_id);
  };

  const interestActionMutation = useMutation(
    () =>
      interestAction(
        isFollowed()
          ? InterestActionV1Actions.unfollow
          : InterestActionV1Actions.follow,
        props.interest_id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", user?.uid!]);
      },
    }
  );

  const cardColor = new ColorHash();

  return (
    <Box
      direction="column"
      width="800px"
      background={{ color: cardColor.hex(props.name) }}
      pad="24px"
      gap="24px"
    >
      <Heading margin="0">{props.name}</Heading>
      <Text>{props.description}</Text>
      {!!user && (
        <Box width="120px" round>
          <Button
            icon={
              isFollowed() ? <Checkmark size="16px" /> : <Add size="16px" />
            }
            label={isFollowed() ? "Followed" : "Follow"}
            secondary={!isFollowed()}
            primary={isFollowed()}
            onClick={() => {
              interestActionMutation.mutate();
            }}
            disabled={interestActionMutation.isLoading}
            color="brand"
          />
        </Box>
      )}
    </Box>
  );
};

export default InterestPageCard;
