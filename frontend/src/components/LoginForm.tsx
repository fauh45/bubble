import React from "react";
import { Box, Button, Header, Text} from 'grommet';
import { navigate } from "@reach/router";
import { Google } from 'grommet-icons';

class LoginForm extends React.Component{
    render(){
        return(
            <Box
            pad={{vertical:'24px'}}
            flex="grow"
            direction="column"
            justify="start"
            gap='64px'
            >
                <Header
                gap="16px"
                align="start"
                direction="column">
                    <Text
                    color="#000"
                    weight="bold"
                    size="large"
                    >Sign in!</Text>
                    <Text
                    color="#000"
                    size="small">Welcome to Bubble!</Text>
                </Header>
                <Button 
                color="#fff"
                icon={<Google size='small'/>}
                primary
                label="Sign in with Google"
                onClick={()=> navigate('/')}
                />
            </Box>);
    }
}

export default LoginForm;