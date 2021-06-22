import React from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { Box, Button, Text } from "grommet";

// Home props definition,
// extends RouteComponentProps as it is used in the route
interface HomeProps extends RouteComponentProps {
  name: string; // Mandatory props of Home
  age?: number; // Optional props of Home
}

const Home = (props: HomeProps): JSX.Element => {
  const { name, age } = props;

  return (
    <Box direction="column" align="center">
      <Text color="neutral-1" size="3xl">
        Hello World! To {name} {age ? "Aged " + age : null}
      </Text>
      <Button
        type="button"
        primary
        margin="medium"
        onClick={() => navigate(name)}
        label={"Navigate to " + name}
      />
    </Box>
  );
};

export default Home;
