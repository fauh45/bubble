import React, { useContext, useState } from "react";
import { Box, Text, Menu } from "grommet";
import { Logout, Tools } from "grommet-icons";
import SearchBar from "../components/SearchBar";

import firebase from "firebase/app";
import "firebase/auth";

import { UserContext } from "../context/user";
import { useQuery, useQueryClient } from "react-query";
import { UserV1GetError, UserV1GetResponse } from "@bubble/common";
import { getUser } from "../api/query";
import { navigate } from "@reach/router";

interface Props {}

const PageHeader: React.FC<Props> = (props) => {
  const user = useContext(UserContext);

  const { data: userData } = useQuery<UserV1GetResponse, UserV1GetError>(
    ["user", user?.uid!],
    () => getUser(user?.uid!),
    {
      staleTime: 1000 * 60 * 5,
      enabled: !!user?.uid,
    }
  );

  const queryClient = useQueryClient();

  const [signingOut, setSigningOut] = useState(false);

  return (
    <Box height="70px" fill="horizontal">
      <Box
        pad={{ horizontal: "40px" }}
        direction="row"
        elevation="small"
        justify="between"
        background={{color:'#F95700'}}
      >
        <Box fill="vertical" justify="center" onClick={() => navigate("/")} hoverIndicator={false}>
          <img
            height="30px"
            width="30px"
            src="/logo192.png"
            alt="Bubble Social"
          />
        </Box>
        <Box fill="vertical" justify="center" pad={{ vertical: "8px" }}>
          <SearchBar />
        </Box>
        <Box fill="vertical" align="center" direction="row">
          <Menu
            label={
              <Text weight="bold" color="white">
                {userData?.name}{" "}
                {userData?.is_moderator && <Tools size="small" color="white" />}
              </Text>
            }
            icon={false}
            dropProps={{
              align: { top: "bottom", right: "right" },
              elevation: "medium",
            }}
            items={[
              {
                disabled: signingOut,
                label: <Text margin={{ right: "16px" }}>Sign out</Text>,
                onClick: async () => {
                  setSigningOut(true);
                  await firebase.auth().signOut();

                  queryClient.invalidateQueries("timeline");
                  queryClient.invalidateQueries("userStatus");

                  setSigningOut(false);
                },
                icon: (
                  <Box
                    fill="vertical"
                    pad={{ left: "8px", right: "16px", vertical: "8px" }}
                  >
                    <Logout size="small" />
                  </Box>
                ),
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
