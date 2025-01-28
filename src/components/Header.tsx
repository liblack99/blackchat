import React, {useState} from "react";
import Search from "./Search";
import SearchResult from "./SearchResult";
import {useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {logout} from "../slices/authSlice";
import {useDispatch} from "react-redux";

const Header: React.FC = () => {
  const {pendingRequests, query} = useSelector(
    (state: RootState) => state.friends
  );
  const dispatch = useDispatch<AppDispatch>();
  const [openRequest, setOpenRequest] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const handleClick = () => {
    setOpenRequest(!openRequest);
    setOpenSearch(false);
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClickSearch = () => {
    setOpenSearch(!openSearch);
    setOpenRequest(false);
    console.log("click");
  };

  return (
    <header className="bg-black w-full h-14  flex gap-4 justify-center items-center ">
      <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-4xl  text-white place-items-end">
        Black Chat
      </h1>
      {query && !openRequest && (
        <div className="absolute top-16 right-14 hidden sm:hidden md:hidden lg:flex z-10 h-auto">
          <SearchResult title={"Send Friend Requests"} />
        </div>
      )}
      <div className="flex justify-center items-center absolute right-2 gap-2">
        <div className="absolute -bottom-[70px] -right-0 z-10">
          {openRequest && <SearchResult title={""} />}
        </div>

        <div className="gap-1 hidden sm:hidden md:hidden lg:block">
          <Search />
        </div>
        {openSearch && (
          <div className="absolute z-10 right-0 -bottom-16 sm:absolute sm:-bottom-16 md:absolute md:-bottom-16 lg:hidden">
            <Search />
            <div className="bg-white w-full h-auto mt-2 max-h-64  absolute z-10">
              {/* Los resultados siempre están visibles debajo del Search */}
              {query && !openRequest && (
                <SearchResult title={"Send Friend Requests"} />
              )}
            </div>
          </div>
        )}
        <button
          className="flex sm:flex md:flex lg:hidden"
          onClick={handleClickSearch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={18}
            fill="white">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </button>
        <button className="text-white text-xl relative" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width={20}
            fill="white">
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
          </svg>
          <span className="absolute -top-3 -right-1 text-sm ">
            {" "}
            {pendingRequests.length}
          </span>
        </button>
        <button onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={20}
            fill="white">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
