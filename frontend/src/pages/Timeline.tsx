import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { Box } from "grommet";
import Page from '../components/Page';
import TimelineItem from '../components/TimelineItem';
import TimelineCreatePost from '../components/TimelineCreatePost';


interface Props extends RouteComponentProps { }

class Timeline extends React.PureComponent<Props>{
  render() {
    return (
      <Page>
        <Box
          fill='horizontal'
          background={{ color: '#f8dac8' }}
          direction='column'
          align='center'
        >
          <TimelineCreatePost />
          {data.length > 0?
          data.map((item)=>{return <TimelineItem userName={item[0]} content={item[1]} likeTotal={item[2]}/>}):null}
        </Box>
      </Page>
    );
  };
};
let data:[String, String, Number][];
data = []
data.push(['bapa', 'mataneLorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores, expedita ipsum. Omnis beatae sint tenetur iste adipisci? Perferendis eius odit rerum dolores doloremque quis iste praesentium! Quaerat doloremque voluptatibus expedita!' , 2])
data.push(['pacar','aku mau putus beb.',3])
data.push(['kakak', 'punya adik gini amat dah',1])

export default Timeline;
