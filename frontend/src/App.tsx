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

const Home = loadable(() => import("./Home"), { fallback: <Loading /> });
const OtherHome = loadable(() => import("./OtherHome"), {
  fallback: <Loading />,
});

// Setting type to theme makes autocomplete works way betters
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
        {/* All props for component are defined, as such autocomplete will work nicely */}
        <Home path="/" name="Jordan" />
        {/* No props here, even though it does have a props, check the file */}
        <OtherHome path="/Jordan" />
      </Router>
    </Grommet>
  );
}

export default App;
