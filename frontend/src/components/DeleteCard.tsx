import React from 'react'
import { Box, Button, Heading, Layer, Text } from 'grommet'


interface DeleteCardProps{
    setterShowDeletePopUp: (b:boolean)=> void,
    currentState:boolean
}


const DeleteCard: React.FC<DeleteCardProps> = ({setterShowDeletePopUp, currentState}:DeleteCardProps) => {
    return (
        <Layer onClickOutside={()=> setterShowDeletePopUp(!currentState)} onEsc={()=> setterShowDeletePopUp(!currentState)}>
            <Box direction='column' pad='32px' gap='24px'>
                <Heading level='3' margin='0'>Confirm!</Heading>
                <Text>Are you sure you want to delete?</Text>
                <Box gap='12px' direction='row' justify='end'>
                    <Button label='Cancel' onClick={ ()=> setterShowDeletePopUp(!currentState)} /> 
                    <Button primary label={<Text color='white'>Delete</Text>} color='red' onClick={ ()=> console}/>
                </Box>
            </Box>
        </Layer>
    );
}

export default DeleteCard