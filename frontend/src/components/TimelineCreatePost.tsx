import React from 'react';
import { Box, Button, Select, TextArea } from 'grommet';

class TimelineCreatePost extends React.Component {
    render() {
        return (
            <Box
                direction='column'
                width='800px'
                background={{ color: 'white' }}
                pad='24px'
                gap='24px'
            >
                <Box
                    flex='grow'
                    height={{ max: '400px' }}
                >
                    <TextArea
                        size='small'
                        fill={true}
                        resize='vertical'
                        placeholder="What's up today"
                    />
                </Box>

                <Box
                    direction='row'
                    justify='end'
                    gap='16px'
                >
                    <Select
                        clear
                        size='small'
                        searchPlaceholder='Search interest..'
                        onSearch={text => { }}
                        plain
                        placeholder='Where to post'
                        options={['a', 'b', 'c']}
                    // value={<Box></Box>}
                    />
                    <Button
                        primary
                        label='Post'
                    />
                </Box>
            </Box>
        );
    }
}

export default TimelineCreatePost;