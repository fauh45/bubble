import React from 'react';
import { Box } from 'grommet';
import InterestItem from '../components/InterestItem';

interface Props{}

class InterestList extends React.Component<Props>{
    render(){
        return(
            <Box
                align='start'
                fill='horizontal'
                gap='16px'
                direction='row'
            >
                <InterestItem name="Wee"/>
                <InterestItem name="Foo"/>
                <InterestItem name="Gaa"/>
                <InterestItem name="Dee"/>
            </Box>
            );
    }
}

export default InterestList;