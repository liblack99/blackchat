import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setQuery, searchUsers} from "../slices/friendsSlice";
import {RootState, AppDispatch} from "../store/store";

const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const query = useSelector((state: RootState) => state.friends.query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    dispatch(setQuery(newQuery));
    dispatch(searchUsers(newQuery));
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        className="rounded p-2 w-72 h-8"
        placeholder="Search friends"
        value={query}
        onChange={handleSearchChange}
      />
    </form>
  );
};

export default Search;
