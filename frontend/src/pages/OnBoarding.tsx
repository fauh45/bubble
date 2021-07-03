import React from 'react';
import { Box, Button, Heading } from 'grommet';
import { navigate, RouteComponentProps } from '@reach/router';
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
                    // background={{color:{light:'#fff', dark:'#333'}}}
                    >
                    <Box
                        margin={{vertical:'24px', horizontal:'40px'}}
                        gap='40px'
                    >
                        <Heading
                            margin='0'
                            level='1'
                        >Choose 3 to 5 interests.
                        </Heading>
                        <Box
                            overflow='auto'
                            flex='shrink'
                            responsive
                        >
                            <InterestList/>
                        </Box>
                        <Box
                            direction='row'
                            gap='32px'
                        >
                            <Box
                            >
                                <Button
                                label='Back'
                                secondary
                                onClick={()=>{navigate(-1)}}
                                />
                            </Box>
                            <Box>
                                <Button
                                label='Ok'
                                primary
                                onClick={()=>{navigate("/")}}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Page>
        );
    }
}

export default OnBoarding;