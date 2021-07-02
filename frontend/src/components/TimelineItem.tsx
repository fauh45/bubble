import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Flag, Like } from 'grommet-icons';

type TimelineItemProps = {
    userName: String;
    content: String;
    likeTotal: Number;
}

class TimelineItem extends React.Component<TimelineItemProps>{

    constructor(props: TimelineItemProps) {
        super(props);
    }

    render() {
        return (
            <Box
                background={{ color: { light: '#fff', dark: '333' } }}
                width='800px'
                pad={{ vertical: '16px', horizontal: '24px' }}
                direction='column'
                gap='16px'
            >
                {/* User ID */}
                <Box
                    direction='row'
                    justify='between'
                >
                    <Box
                        direction='column'
                    >
                        <Box
                            align='start'
                            justify='start'
                            direction='row'
                            gap='24px'
                            margin={{bottom:'8px'}}
                        >
                            <Box>
                                <img
                                    height='20px'
                                    width='20px'
                                    src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
                                    alt="new" />
                            </Box>
                            <Box
                                align='start'
                            >
                                {this.props.userName}
                            </Box>
                        </Box>
                        <Box
                            direction='row'
                            gap='8px'
                        >
                            <Box>
                                <Text
                                    color={{light:'#aaaaaa', dark:'#99999'}}
                                    size='xsmall'
                                >{Date()}</Text>
                            </Box>
                            <Box>
                                <Text color={{light:'#666666', dark:'#99999'}} size='xsmall'>From</Text>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        fill='vertical'
                        align='start'
                    >
                        <Button icon={<Flag size='18px' />} />
                    </Box>
                </Box>
                {/* The content */}
                <Box
                    wrap={true}
                >
                    <Text>
                        {this.props.content}
                    </Text>
                </Box>
                {/* Interact section */}
                <Box
                    direction='row'
                >
                    <Button icon={<Like size='18px' />} />
                    <Box justify='center'>
                        <Text size='small'>{this.props.likeTotal}</Text>
                    </Box>
                </Box>
            </Box>
        );
    }

}

export default TimelineItem;