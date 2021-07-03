import React from 'react';
import { Box } from 'grommet';
import InterestItem from '../components/InterestItem';

interface Props{}

let interestitems = ['Programming', 'Music', 'Art', 'Cooking', 'Sports', 'Science'];

class InterestList extends React.Component<Props>{
    render(){
        return(
            <Box
                align='start'
                fill='horizontal'
                gap='48px'
                direction='row-responsive'
            >
                {interestitems.map((item)=>{return <InterestItem name={item}/>})}
            </Box>
            );
    }
}

export default InterestList;