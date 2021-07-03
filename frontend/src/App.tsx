import React from "react";
import { Grommet, Heading, Text, ThemeType, Box } from "grommet";
import { Router } from "@reach/router";
import loadable from "@loadable/component";

const Loading: React.FC = () => (
  <Box align="center">
    <Text size="2xl">Loading...</Text>
  </Box>
);

const Timeline = loadable(() => import("./pages/Timeline"), { fallback: <Loading /> });
const Login = loadable(() => import("./pages/Login"), {fallback: <Loading/>});
const OnBoarding = loadable(() => import("./pages/OnBoarding"), {fallback: <Loading/>});
const NotFound = loadable(()=> import("./pages/NotFound"), {fallback:<Loading/>})

const theme: ThemeType = {
  global: {
    colors: {
      "neutral-1": "#00873D",
    },
  },
};

function App() {
  return (
    <Grommet full theme={theme}>
      <Router>
        <NotFound default/>
        <Timeline path="/"/>
        <Login path="/login"/>
        <OnBoarding path="/onboarding"/>
      </Router>
    </Grommet>
  );
}

export default App;
