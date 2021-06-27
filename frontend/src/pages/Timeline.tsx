import React from 'react';
import { navigate, RouteComponentProps } from "@reach/router";
import { Box, Button, Text } from "grommet";
import Page from '../components/Page';
import TimelineItem from '../components/TimelineItem';

// Home props definition,
// extends RouteComponentProps as it is used in the route
interface Props extends RouteComponentProps {}

class Timeline extends React.PureComponent<Props>{
  render(){
  return (
    <Page>
      <Box
        background={{color:'#f8dac8'}}
        direction='column'
        gap='large'
      >
        <Box>
        List Timeline
        </Box>
        <TimelineItem/>
        <Box>
          <Button
          label="login"
          onClick={()=>{navigate("/login")}}
          />
        </Box>
      </Box>
    </Page>
  );
  };
};

export default Timeline;
