import React from "react";
import "../../assets/css/SearchBar.css";
import { FiSearch } from "react-icons/fi"; 

const SearchBar = ({ onSearch }) => {
  return (
    <div className="styled-search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
