import React, { useContext, useEffect, useState } from "react";
import { Grommet, ThemeType, Layer, Box, Spinner } from "grommet";
import { Redirect, RouteComponentProps, Router } from "@reach/router";
import loadable from "@loadable/component";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import firebase from "firebase/app";
import "firebase/auth";

import { UserContext } from "./context/user";

const firebaseConfig = {
  apiKey: "AIzaSyCDePcclwcbZ3_6ejGdJovGbu9SExdjbg0",
  authDomain: "bubble-social-8b21e.firebaseapp.com",
  projectId: "bubble-social-8b21e",
  storageBucket: "bubble-social-8b21e.appspot.com",
  messagingSenderId: "616608871503",
  appId: "1:616608871503:web:b5bc95b9c91d12f779e63a",
  measurementId: "G-JT148NJNJG",
};

firebase.initializeApp(firebaseConfig);

const Loading: React.FC = () => (
  <Layer full animate={false} animation={false}>
    <Box align="center" justify="center" fill>
      <Spinner size="medium" />
    </Box>
  </Layer>
);

const Authenticated: React.FC<RouteComponentProps> = (props) => {
  const user = useContext(UserContext);

  if (user) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/login" noThrow />;
  }
};

const Timeline = loadable(() => import("./pages/Timeline"), {
  fallback: <Loading />,
});
const InterestPage = loadable(() => import("./pages/InterestPage"), {
  fallback: <Loading />,
});
const Login = loadable(() => import("./pages/Login"), {
  fallback: <Loading />,
});
const OnBoarding = loadable(() => import("./pages/OnBoarding"), {
  fallback: <Loading />,
});
const NotFound = loadable(() => import("./pages/NotFound"), {
  fallback: <Loading />,
});

const theme: ThemeType = {
  global: {
    colors: {
      "neutral-1": "#00873D",
    },
  },
};

const queryClient = new QueryClient();

function App() {
  const [auth, setAuth] = useState<firebase.User | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuth(user);
    });

    console.log(auth);
  }, [auth]);

  return (
    <UserContext.Provider value={auth}>
      <QueryClientProvider client={queryClient}>
        <Grommet full theme={theme}>
          <Router>
            <NotFound default />
            <Login path="/login" />
            <InterestPage path="/i/:interestId" />

            <Authenticated path="/">
              <Timeline path="/" />
              <OnBoarding path="/onboarding" />
            </Authenticated>
          </Router>
        </Grommet>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </UserContext.Provider>
  );
}

export default App;
