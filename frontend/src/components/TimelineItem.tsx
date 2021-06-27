import React from 'react';
import { Box, Text } from 'grommet';

// interface props extends 

class TimelineItem extends React.Component{

    render(){
        return(
            <Box
                background={{color:'#fafafa'}}
                // width={{min:'50%', max:'800px'}}
                width='800px'
                pad={{vertical:'16px', horizontal:'24px'}}
                direction='column'
                gap = '16px'
            >
                {/* User ID */}
                <Box
                    direction='column'
                >
                    <Box
                        align ='start'
                        direction='row'
                        gap='24px'
                    >
                        <Box>
                            <img 
                                height='20px'
                                width='20px'
                                src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
                                alt="new"/>
                        </Box>
                        <Box>
                            user name
                        </Box>
                    </Box>
                    <Box>
                        <Text
                            size='xsmall'
                        >{Date()}</Text>
                    </Box>
                </Box>

                {/* The content */}
                <Box
                    flex='shrink'
                    // wrap='true'
                    overflow={{horizontal:'visible'}}
                >
                    <Text>
                    bababababababababababababababababababababababababababababababababababababababababababababababababababababababababababababababa
                    </Text>
                </Box>
            </Box>
        );
    }

}

export default TimelineItem;