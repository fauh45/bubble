import React, {useState} from "react";
import { TextInput, ThemeContext } from "grommet";
import { Search } from "grommet-icons";

const SearchBar: React.FC = (props) => {

  const suggestions =  Array(10).fill(1).map((_, i) => `suggestion ${i + 1}`);

  const [value, setValue] = useState("");

  return (
    <ThemeContext.Extend
      value={{
        global: {
          focus: {
            outline: {
              color: "transparent",
            },
          },
          control: {
            border: {
              radius: "25px",
            },
          },
        },
      }}
    >
      <TextInput
        icon={<Search color="#C9C9C9" />}
        size="small"
        placeholder="Search interest"
        value={value}
        suggestions={suggestions}
        onChange={event=> setValue(event.target.value)}
        onSuggestionSelect={event=> setValue(event.suggestion)}

      />
    </ThemeContext.Extend>
  );
};

export default SearchBar;
