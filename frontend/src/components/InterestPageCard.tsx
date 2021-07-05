import React from 'react';
import { Box, Heading, Text } from 'grommet';

type InterestPageCardProps ={
    name:String;
    description:String;
}

class InterestPageCard extends React.Component<InterestPageCardProps>{

    render(){
        return(
            <Box
                direction='column'
                width='800px'
                background={{ color: {light:'#333333', dark:'#333333'} }}
                pad='24px'
                gap='24px'
            >
                <Heading margin='0'>
                    {this.props.name}
                </Heading>
                <Text>
                     {this.props.description}
                </Text>
            </Box>
        );
    }
}

export default InterestPageCard;