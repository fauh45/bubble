import React from 'react';
import { Box, Button, Heading, Text } from 'grommet';
import {Add, Checkmark} from 'grommet-icons';

import ColorHash from 'color-hash';

interface InterestPageCardProps {
    name:string;
    description:string;
}

class InterestPageCard extends React.Component<InterestPageCardProps>{

    constructor(props:InterestPageCardProps){
        super(props);

        this.state={
            
        }
    }

    render(){

        let cardColor = new ColorHash()

        return(

            <Box
                direction='column'
                width='800px'
                background={{ color:  cardColor.hex(this.props.name)}}
                pad='24px'
                gap='24px'
            >
                <Heading margin='0'>
                    {this.props.name}
                </Heading>
                <Text>
                    {this.props.description}
                </Text>
                <Box
                    width='112px'
                    background={{color:'whitesmoke'}}
                    round
                >
                    <Button
                        icon={<Add size='16px'/>} // icon={<Checkmark size='16px'/>}
                        label='Follow' // label ='followed'
                        secondary // primary 
                        color="brand"
                    />
                </Box>
            </Box>
        );
    }
}

export default InterestPageCard;