import React from 'react';
import { Box, Heading } from 'grommet';
import { RouteComponentProps } from '@reach/router';
import Page from '../components/Page';
import InterestList from '../components/InterestList';

interface Props extends RouteComponentProps{}

class OnBoarding extends React.PureComponent<Props>{
    render(){
        return(
            <Page>
                <Box
                    fill='horizontal'
                    overflow='auto'
                    background={{color:{light:'#fff', dark:'#333'}}}>
                    <Box
                        margin={{vertical:'24px', horizontal:'40px'}}
                    >
                        <Heading
                            margin='0'
                            level='1'
                        >Choose 3 or more interests.
                        </Heading>
                        <Box>
                            <InterestList/>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }
}

export default OnBoarding;