import React from "react";

interface SearchResultProps {
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchFriends: React.FC<SearchResultProps> = ({onChangeName}) => {
  return (
    <form className="flex gap-1 w-[90%]" onSubmit={(e) => e.preventDefault()}>
      <input
        id="searchInput"
        type="text"
        className=" p-2 w-full h-10 border-2 border-black shadow-sm rounded-full"
        placeholder="Search friends"
        onChange={(e) => onChangeName(e)}
      />
    </form>
  );
};

export default SearchFriends;
