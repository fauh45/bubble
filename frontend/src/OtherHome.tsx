import { navigate, RouteComponentProps } from "@reach/router";
import { Box, Text, Button } from "grommet";
import React from "react";

interface OtherHomeProps extends RouteComponentProps {
  end?: boolean; // Optional Props
  amazingNumber?: number; // Optional Props
}

// Optional Props can have their default value set
const defaultProps: OtherHomeProps = {
  amazingNumber: 420,
  end: true,
};

const OtherHome: React.FC<OtherHomeProps> = (props) => {
  const { amazingNumber, end, location } = props;
  return (
    <Box direction="column" align="center">
      <Text color="neutral-1" size="3xl">
        Hello Welcome to {location?.pathname.replace("/", "")}!
      </Text>
      <Text>Amazing number is {amazingNumber}</Text>

      {end ? (
        <Button
          type="button"
          primary
          margin="medium"
          onClick={() => navigate("/")}
          label={"Navigate to Home"}
        />
      ) : null}
    </Box>
  );
};

// Set the default props here
OtherHome.defaultProps = defaultProps;

export default OtherHome;
