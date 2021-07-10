import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Box, Layer } from 'grommet';
// import Page from '../components/Page';
import LoginForm from '../components/LoginForm';

interface Props extends RouteComponentProps { }

class Login extends React.Component<Props>{
    render() {
        return (
            // <Page  header={false}>
            <Layer full position='center' animate={false} animation={false}>
                <Box fill align='center' justify='center'>
                    <Box
                        align="center"
                        justify="center"
                        fill="horizontal"
                        overflow="auto"
                    pad={{horizontal:"32px", vertical:"64px"}}
                    >
                        <Box
                            align="start"
                            elevation="medium"
                            flex="grow"
                            overflow="auto"
                            background={{ color: "#F95700" }}
                            direction="row-responsive"
                            height={{ max: '800px' }}
                            round="15px"
                        >
                            <Box
                                flex="grow"
                                fill="vertical"
                                pad={{ vertical: '16px', horizontal: '32px' }}
                            >
                                <LoginForm />
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Layer>
            // </Page>
        );
    }
}

export default Login;