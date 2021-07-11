import React, {useState}  from 'react'
import { Box, Button, Form, FormField, Heading, Layer, TextInput } from 'grommet'


interface AddInterestProps {
    name:string,
    description: string
    setterShowAddPopUp: (b:boolean)=> void,
    currentState:boolean
}

const AddInterestCard: React.FC<AddInterestProps> = (props) => {
    
    const [value, setValue] = useState({
        id:"",
        name:"",
        description:""
    })

    return (
        <Layer onClickOutside={()=> props.setterShowAddPopUp(!props.currentState)} onEsc={()=> props.setterShowAddPopUp(!props.currentState)}>
            <Box background={{color:'white'}} >
                
                <Box direction='column' pad='24px' gap='16px' width='800px' border={{side:'top', size:'2px', color:'black'}}>
                    <Heading level='3' margin='0'>
                        Create new Interest
                    </Heading>
                    <Form>
                        <FormField label='Interest Id'>
                            <TextInput value={value.id} name='id' onChange={event => setValue({...value, id:event.target.value})}/>
                        </FormField>

                        <FormField label='Interest Name'>
                            <TextInput value={value.name} name='name' onChange={event => setValue({...value, name:event.target.value})}/>
                        </FormField>

                        <FormField label='Interest Description'>
                            <TextInput value={value.description} name='description' onChange={event => setValue({...value, description:event.target.value})}/>
                        </FormField>

                        <Box gap='8px' direction='row' justify='end'>
                            <Button label='Cancel' onClick={ ()=> props.setterShowAddPopUp(!props.currentState)} /> 
                            <Button primary label='Confirm' />
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Layer>
    );
}

export default AddInterestCard