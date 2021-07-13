import React, { useContext, useState } from "react";
import { Box, Button, Heading, Menu, Text } from "grommet";
import { Add, Checkmark, Configure } from "grommet-icons";

import ColorHash from "color-hash";
import { UserContext } from "../context/user";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUser } from "../api/query";
import { interestAction } from "../api/mutation";
import { InterestActionV1Actions } from "@bubble/common";

import AdminAdd from "../components/AddInterestCard";

interface InterestPageCardProps {
  interest_id: string;
  name: string;
  description: string;
  followers_count:number;
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

  const [showAddPopUp, setShowAddPopUp] = useState(false);

  return (
    <Box
      direction="row"
      width="800px"
      background={{ color: cardColor.hex(props.name) }}
      justify="between"
    >
      <Box direction="column" pad="24px" gap="24px">
        <Heading margin="0">{props.name}</Heading>
        <Box gap='8px'>
          <Text>{props.description}</Text>
          <Text size='small' color='#AAAAAA'>{props.followers_count} followers</Text>
        </Box>
        {!!user && (
          <Box direction ='row' gap='24px'>
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
          </Box>
        )}
      </Box>

      {!!user && !!data && data.is_moderator && (
        <Box pad="24px">
          <Menu
            dropBackground={{ color: "white" }}
            dropProps={{
              align: { top: "bottom", right: "right" },
            }}
            icon={<Configure color="white" />}
            items={[
              {
                icon: (
                  <Box
                    fill="vertical"
                    pad={{ left: "8px", right: "16px", vertical: "8px" }}
                  >
                    <Add size="small" />
                  </Box>
                ),
                label: <Text margin={{ right: "16px" }}>Add new interest</Text>,
                onClick: () => {
                  setShowAddPopUp(true);
                },
              },
            ]}
          />

          {showAddPopUp && (
            <AdminAdd
              setterShowAddPopUp={setShowAddPopUp}
              currentState={showAddPopUp}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default InterestPageCard;
