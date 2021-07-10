import React from 'react';
import { Box} from 'grommet';
import PageHeader from '../components/PageHeader'

interface Props{
    header:Boolean
}

class Page extends React.PureComponent<Props>{
    render(){
        return(
            <Box
                direction="column"
                fill="vertical"
                flex= "grow"
            >
                {this.props.header?
                <PageHeader/>: null}
                {this.props.children}
            </Box>
        );
    }
}

export default Page;