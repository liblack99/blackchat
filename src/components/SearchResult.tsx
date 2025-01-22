import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  updatePendingRequests,
  addSendFriendRequest,
  addFriend,
} from "../slices/friendsSlice";
import {RootState} from "../store/store";
import {AppDispatch} from "../store/store";
import {getSocket} from "../utils/socket";

interface SearchResultProps {
  title: string; // Prop para distinguir entre los modos
}

interface Friend {
  id: number;
  friend_id: number;
  username: string;
  profileImage: string;
}

const SearchResult: React.FC<SearchResultProps> = ({title}) => {
  const {searchResults, pendingRequests, friends, sentRequests} = useSelector(
    (state: RootState) => state.friends
  );

  const dispatch = useDispatch<AppDispatch>();

  const {loading, user} = useSelector((state: RootState) => state.auth);

  const handleSendRequest = (friendId: number) => {
    dispatch(addSendFriendRequest(friendId));
    const socket = getSocket();
    if (socket) {
      socket.emit("sendFriendRequest", friendId);
    }
  };

  const handleAcceptRequest = (request: Friend) => {
    dispatch(acceptFriendRequest(request.id));
    dispatch(addFriend(request));
    dispatch(updatePendingRequests(request.id));
  };

  const handleRejectRequest = (request: Friend) => {
    dispatch(rejectFriendRequest(request.id));
    dispatch(updatePendingRequests(request.id));
  };

  if (loading) {
    return null;
  }

  // Determinar la lista a iterar según el título
  const listToRender =
    title === "Send Friend Requests" ? searchResults : pendingRequests;

  return (
    <div className="max-w-72 w-80 min-h-10 h-auto bg-white rounded-lg shadow-md border-1 border-black flex flex-col justify-center items-center">
      <ul className="flex flex-col justify-center font-bold gap-2 w-full">
        {listToRender.length !== 0 ? (
          listToRender.map((result) => {
            const isSelf = user?.id === result.id;
            const isFriend = friends.some(
              (friend) => friend.friend_id === result.id
            );
            const hasSentRequest = sentRequests.includes(result.id);
            return (
              <li
                key={result.id}
                className="p-2 shadow-sm flex justify-between items-center">
                <div className="flex gap-2 justify-center items-center">
                  <img
                    src={result.profileImage}
                    alt="foto de perfil"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <p>{result.username}</p>
                </div>
                {title === "Send Friend Requests" ? (
                  // Botón para enviar solicitudes de amistad
                  <button
                    onClick={() => handleSendRequest(result.id)}
                    disabled={isSelf || isFriend}
                    className={`border-1 border-black bg-black text-white px-2 py-1 rounded text-sm w-24 ${
                      isSelf || isFriend || hasSentRequest
                        ? "opacity-[0.5]"
                        : "opacity-1 hover:scale-105"
                    }`}>
                    {isFriend
                      ? "Friend"
                      : hasSentRequest
                      ? "Sent"
                      : "Add Friend"}
                  </button>
                ) : (
                  // Botones para aceptar/rechazar solicitudes pendientes
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(result)}
                      className="border-1 border-green-500 bg-green-500 text-white p-1 rounded">
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(result)}
                      className="border-1 border-red-500 bg-red-500 text-white p-1 rounded">
                      Reject
                    </button>
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <div className="flex justify-center items-center w-full h-14">
            <p className="p-2 text-md text-center ">
              {title === "Send Friend Requests"
                ? "No results were found."
                : "You have no pending requests."}
            </p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default SearchResult;
