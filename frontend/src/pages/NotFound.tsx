import React from 'react';
import { Box, Button, Heading } from 'grommet';
import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {}

class NotFound extends React.Component<Props>{

    render(){
        return(
            <Box
                fill='horizontal'
                align='center'
            >
                <Heading 
                    level='1'
                    margin='large'>
                    Sorry, your page is missing..
                </Heading>
                <Box>
                    <Button label='Back'/>
                </Box>
            </Box>
        );
    }
}

export default NotFound;