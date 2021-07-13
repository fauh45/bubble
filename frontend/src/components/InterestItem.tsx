import React from "react";
import { CheckBox, ThemeContext } from "grommet";

interface InterestItemProps {
  name: string;
  id: string;
  handleChoice(interest_id: string, checked: boolean): void;
  status?: boolean;
  checked: boolean;
}

const InterestItem: React.FC<InterestItemProps> = (props) => {
  const { name, id, handleChoice } = props;

  return (
    <ThemeContext.Extend
      value={{
        checkBox: {
          border: {
            color: {
              dark: "#fff",
              light: "orange",
            },
          },
          hover: {
            background: {
              color: "transparent",
            },
          },
          size: "18px",
          toogle: {
            background: "blue",
          },
        },
      }}
    >
      <CheckBox
        onChange={(event) => handleChoice(id, event.target.checked)}
        checked={props.checked}
        label={name}
      />
    </ThemeContext.Extend>
  );
};

export default InterestItem;
