import React, { useContext } from 'react'
import { Box, Text, Menu } from 'grommet'
import {Logout} from 'grommet-icons'
import SearchBar from '../components/SearchBar'


import { UserContext } from "../context/user";

interface Props { }

const PageHeader: React.FC<Props> = (props) => {

    const user = useContext(UserContext);

    return (
        <Box
            height='70px'
            fill='horizontal'
        >
            <Box
                pad={{ horizontal: '40px' }}
                direction='row'
                elevation='small'
                justify='between'
            >
                <Box
                    fill='vertical'
                    justify='center'
                >
                    <img
                        height="30px"
                        width="30px"
                        src="/logo192.png"
                        alt="Bubble Social" />
                </Box>
                <Box
                    fill='vertical'
                    justify='center'
                    pad={{ vertical: '8px' }}
                >
                    <SearchBar />
                </Box>
                <Box
                    fill='vertical'
                    align='center'
                    direction='row'
                >
                    <Menu
                        label={<Text weight='bold'>{user?.displayName}</Text>}
                        icon={false}
                        dropProps={{
                            align: { top: 'bottom', right: 'right' },
                            elevation: 'medium',
                        }}
                        items={[
                            {
                                label: (<Text margin={{ right: '16px' }}>Sign out</Text>),
                                onClick: () => { },
                                icon: (<Box fill='vertical' pad={{ left: '8px', right: '16px', vertical: '8px' }}><Logout size='small' /></Box>)
                            }
                        ]}
                    />


                </Box>
            </Box>
        </Box>
    );
}

export default PageHeader
