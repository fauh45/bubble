import React, {useState}  from 'react'
import { Box, Button, Form, FormField, Heading, Layer, TextInput } from 'grommet'


interface EditInterestProps {
    name:string,
    description: string
    setterShowEditPopUP: (b:boolean)=> void,
    currentState:boolean
}

const EditInterestCard: React.FC<EditInterestProps> = (props) => {
    
    const [value, setValue] = useState({
        name:props.name,
        description:props.description
    })

    return (
        <Layer onClickOutside={()=> props.setterShowEditPopUP(!props.currentState)} onEsc={()=> props.setterShowEditPopUP(!props.currentState)}>
            <Box background={{color:'white'}} >
                
                <Box direction='column' pad='24px' gap='16px' width='800px' border={{side:'top', size:'2px', color:'black'}}>
                    <Heading level='3' margin='0'>
                        Edit {props.name} properties
                    </Heading>
                    <Form>
                        <FormField label='Edit Name'>
                            <TextInput value={value.name} name='name' onChange={event => setValue({...value, name:event.target.value})}/>
                        </FormField>

                        <FormField label='Edit Description'>
                            <TextInput value={value.description} name='description' onChange={event => setValue({...value, description:event.target.value})}/>
                        </FormField>

                        <Box gap='8px' direction='row' justify='end'>
                            <Button label='Cancel' onClick={ ()=> props.setterShowEditPopUP(!props.currentState)} /> 
                            <Button primary label='Confirm' />
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Layer>
    );
}

export default EditInterestCard