import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Box } from 'grommet';
import Page from '../components/Page';
import LoginForm from '../components/LoginForm';

interface Props extends RouteComponentProps{}

class Login extends React.Component<Props>{
    render(){
        return(
            <Page>
                <Box
                    align="center"
                    justify="center"
                    // flex="shrink"
                    
                    fill="horizontal"
                    overflow="auto"
                    // background={{color:"blue"}}
                    // margin={{vertical:""}}
                    pad={{horizontal:"32px", vertical:"64px"}}
                >
                    <Box
                        align="start"
                        elevation="medium"
                        flex="grow"
                        overflow="auto"
                        background={{color:"#f1651d"}}
                        direction="row-responsive"
                        height={{max:'800px'}}
                        round="15px"
                    >
                        <Box
                            flex="grow"
                            fill="vertical"
                            pad={{vertical:'16px', horizontal:'32px'}}
                        >
                            <LoginForm/>
                        </Box>

                    </Box>
                </Box>
            </Page>
        );
    }
}

export default Login;