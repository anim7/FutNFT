import React from "react";
import searchStyles from "../styles/Search.module.scss";

interface Props {
  handleClick: () => void;
  id: string;
}

const Search: React.FunctionComponent<Props> = ({ handleClick, id }) => {
  return (
    <div className={searchStyles.searchContainer}>
      <input
        type="search"
        className={searchStyles.searchBar}
        placeholder="Search Players..."
        id={id}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            handleClick();
          }
        }}
      />
      <button className={searchStyles.searchBtn} onClick={handleClick}>
        &#x1F50E;&#xFE0E;
      </button>
    </div>
  );
};

export default Search;
