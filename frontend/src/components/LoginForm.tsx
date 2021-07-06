import React from "react";
import { Box, Button, Header, Text } from "grommet";
import { navigate } from "@reach/router";
import { Google } from "grommet-icons";

import firebase from "firebase/app";
import "firebase/auth";
import { UserContext } from "../context/user";

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.email");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

firebase.auth().useDeviceLanguage();

type AuthStatus =
  | {
      status: "noauth";
    }
  | {
      status: "success";
    }
  | {
      status: "error";
      message: String;
    };

interface LoginFormProps {}

interface LoginFormState {
  auth_status: AuthStatus;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = {
      auth_status: {
        status: "noauth",
      },
    };
  }

  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  componentDidMount() {
    if (this.context) {
      navigate("/");
    }
  }

  componentDidUpdate() {
    if (this.context) {
      navigate("/");
    }
  }

  handleAuth() {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            this.setState({
              auth_status: { status: "error", message: error.message },
            });
          });
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <Box
        pad={{ vertical: "24px" }}
        flex="grow"
        direction="column"
        justify="start"
        gap="64px"
      >
        <Header gap="16px" align="start" direction="column">
          <Text color="#000" weight="bold" size="large">
            Sign in!
          </Text>
          <Text color="#000" size="small">
            Welcome to Bubble!
          </Text>
        </Header>
        <Button
          color="#fff"
          icon={<Google size="small" />}
          primary
          label="Sign in with Google"
          onClick={() => this.handleAuth()}
        />
      </Box>
    );
  }
}

export default LoginForm;
