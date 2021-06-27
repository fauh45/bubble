import React from 'react';
import { Box } from 'grommet';

class Page extends React.PureComponent{
    render(){
        return(
            <Box
                direction="row"
                fill="vertical"
                flex= "grow"
            >
                {this.props.children}
            </Box>
        );
    }
}

export default Page;