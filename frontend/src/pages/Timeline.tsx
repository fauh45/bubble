import React from 'react';
import { navigate, RouteComponentProps } from "@reach/router";
import { Box, Button, Text } from "grommet";
import Page from '../components/Page'

// Home props definition,
// extends RouteComponentProps as it is used in the route
interface Props extends RouteComponentProps {}

class Timeline extends React.Component<Props>{
  render(){
  return (
    <Page>
      List Timeline
      <Button
      label="login"
      onClick={()=>{navigate("/login")}}
      />
    </Page>
  );
  };
};

export default Timeline;
