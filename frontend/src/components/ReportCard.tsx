import React from 'react'
import { Box, Button, Layer, Text, TextArea } from 'grommet'


interface AdminReportProps {

    message: string
}

interface ReportCardProps{
    setterShowReportPopUp: (b:boolean)=> void,
    currentState:boolean
}

const AdminReport: React.FC<AdminReportProps> = ({ message }: AdminReportProps) => {

    return (
        <Box 
            gap='16px' 
            border='all' 
            height={{min:'200px'}} 
            round='25px'
        >
            <Box 
                background='linear-gradient(102.77deg, #865ED6 -9.18%, #18BAB9 209.09%)' 
                pad='16px' 
                round={{size:'25px', corner:'top'}} 
                fill
            >
            </Box>
            <Box 
                pad={{horizontal:'16px', vertical:'8px'}}
            >
                <Text>{message}</Text>
            </Box>
        </Box>
    );
}

const ReportCard: React.FC<ReportCardProps> = ({setterShowReportPopUp, currentState}:ReportCardProps) => {
    return (
        <Layer onClickOutside={()=> setterShowReportPopUp(!currentState)} onEsc={()=> setterShowReportPopUp(!currentState)}>
            <Box >
                {/* Admin */}
                {/* Add some flow control */}
                {/* <Box direction='column' pad='16px' gap='24px' width='760px' flex overflow='auto' height={{max:'320px'}}>
                    <AdminReport message='gg'/>
                </Box> */}

                {/* Report */}
                <Box direction='column' pad='24px' gap='16px' width='760px' border={{side:'top', size:'2px', color:'black'}}>
                    <Box height={{ min:'82px', max: '112px' }}>
                        <TextArea
                            placeholder='Write the report message here..'
                            resize='vertical'
                        />
                    </Box>
                    <Box gap='8px' direction='row' justify='end'>
                        <Button label='Cancel' onClick={ ()=> setterShowReportPopUp(!currentState)} /> 
                        <Button primary label='Confirm' />
                    </Box>
                </Box>
            </Box>
        </Layer>
    );
}

export default ReportCard