import React, {useState} from 'react'
import { TextInput, ThemeContext } from 'grommet'
import { Search } from 'grommet-icons'

import {useQuery} from 'react-query'
import { searchInterest } from "../api/query";

const SearchBar: React.FC = (props) => {
   
    return (
        <ThemeContext.Extend value={{
            global: {
                focus: {
                    outline: {
                        color: 'transparent'
                    }
                },
                control: {
                    border: {
                        radius: '25px'
                    }
                }
            }
        }}>
            <TextInput
                icon={<Search color='#C9C9C9' />}
                size='small'
                placeholder='Search interest'
            />
        </ThemeContext.Extend>
    );
}

export default SearchBar