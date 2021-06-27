import React from 'react';
import { CheckBox, ThemeContext } from 'grommet'; 

interface InterestItemProps{
    name: string;
    status?:boolean;
}

const InterestItem : React.FC<InterestItemProps> = (props)=>{
    const {name, status} = props;
 
    return(
        <ThemeContext.Extend 
            value={
                {
                    checkBox:{
                        border:{
                            color:{
                                'dark':'#fff',
                                'light':'orange'
                            }
                        },
                        hover:{
                            background:{
                                color:'transparent'
                            }
                        },
                        size:'18px',
                        toogle:{
                            background:'blue',
                        }
                    }
                }
            }>    
            <CheckBox
              label={name}
            />
        </ThemeContext.Extend>
    );
}

export default InterestItem;