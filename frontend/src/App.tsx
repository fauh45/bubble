import React from "react";
import { Grommet, Text, ThemeType, Box } from "grommet";
import { Router } from "@reach/router";
import loadable from "@loadable/component";
import "./App.css";

const Loading: React.FC = () => (
  <Box align="center">
    <Text size="2xl">Loading...</Text>
  </Box>
);

const Timeline = loadable(() => import("./pages/Timeline"), { fallback: <Loading /> });
const OtherHome = loadable(() => import("./pages/OtherHome"), {fallback: <Loading />});
const Login = loadable(() => import("./pages/Login"), {fallback: <Loading/>});
const OnBoarding = loadable(() => import("./pages/Login"), {fallback: <Loading/>});

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
        <Timeline path="/"/>
        <OtherHome path="/Jordan" title="gaga" />
        <Login path="/login"/>
        <OnBoarding path="/gg"/>
      </Router>
    </Grommet>
  );
}

export default App;
