import React from "react";

interface SearchResultProps {
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchFriends: React.FC<SearchResultProps> = ({onChangeName}) => {
  return (
    <input
      type="text"
      className=" p-2 w-[90%] h-10 shadow rounded-lg"
      placeholder="Search friends"
      onChange={(e) => onChangeName(e)}
    />
  );
};

export default SearchFriends;
