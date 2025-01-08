import React from "react";

const SearchFriends: React.FC = () => {
  return (
    <form className="flex gap-1 w-[90%]" onSubmit={(e) => e.preventDefault()}>
      <input
        id="searchInput"
        type="text"
        className=" p-2 w-full h-10 border-2 border-black shadow-sm rounded-full"
        placeholder="Search friends"
      />
    </form>
  );
};

export default SearchFriends;
