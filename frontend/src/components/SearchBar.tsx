import React, { useState } from "react";
import { Box, TextInput, ThemeContext } from "grommet";
import { Search } from "grommet-icons";
import { useQuery } from "react-query";
import { searchInterest } from "../api/query";
import { navigate } from "@reach/router";

const SearchBar: React.FC = (props) => {
  const [query, setQuery] = useState("");

  const searchQuery = useQuery(
    ["interestQuery", query],
    () => searchInterest(query),
    {
      enabled: Boolean(query),
      staleTime: 1000 * 60,
    }
  );

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
      <Box background={{color:'white'}} round>
        <TextInput
          icon={<Search color="#C9C9C9" />}
          size="small"
          placeholder="Search interest"
          value={query}
          suggestions={
            searchQuery.isLoading || searchQuery.isIdle
              ? []
              : searchQuery.data?.slice(0, 5).map((item) => {
                  return { label: item.name, value: item._id };
                })
          }
          onChange={(event) => setQuery(event.target.value)}
          onSuggestionSelect={(event) => navigate("/i/" + event.suggestion.value)}
        />
      </Box>
    </ThemeContext.Extend>
  );
};

export default SearchBar;
