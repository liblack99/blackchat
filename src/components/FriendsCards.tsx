import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setFriendChatId} from "../slices/friendsSlice";
import {
  getConversation,
  markMessagesAsDelivered,
} from "../slices/messagesSlice";
import {useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface PropsFriend {
  friend_id: number;
  username: string;
  profileImage: string;
  handleClick: () => void;
}
interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  delivered: number;
}

const FriendsCards: React.FC<PropsFriend> = ({
  friend_id,
  profileImage,
  username,
  handleClick,
}) => {
  const {user, token} = useSelector((state: RootState) => state.auth);
  const {friends} = useSelector((state: RootState) => state.friends);
  const {conversation} = useSelector((state: RootState) => state.messages);
  const [message, setMessage] = useState<Message>();

  const dispatch = useDispatch<AppDispatch>();

  const handleCardClick = (friendId: number) => {
    dispatch(setFriendChatId(friendId));
    fetchConversation(friendId);
    handleClick();
    markMessagesAsDelivered(friendId);
  };

  const fetchConversation = (otherUserId: number) => {
    getConversation(otherUserId, dispatch);
  };

  useEffect(() => {
    const getLatestMessage = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chat/last-message`, {
          params: {friendId: friend_id},
          headers: {
            Authorization: `Bearer ${token}`, // Token de autenticación
          },
        });
        setMessage(response.data);
      } catch (error) {
        console.error("Error al obtener el último mensaje:", error);
        throw error;
      }
    };
    getLatestMessage();
  }, [conversation, friends]);

  return (
    <div
      className="w-full py-3 cursor-pointer hover:scale-105 transition-all duration-300 shadow rounded-lg "
      onClick={() => handleCardClick(friend_id)}>
      <div className="flex items-center pl-4 gap-3">
        <div className="w-16 h-16 border border-1 rounded-full overflow-hidden">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`Profile photp ${username}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                height={28}
                fill="white">
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 text-black">
          <h2 className="text-lg font-semibold">{username}</h2>
          <div className="flex justify-between items-center">
            <p className="text-md h-6 text-gray-600 truncate max-w-[75%]">
              {message?.sender_id === user?.id
                ? `You: ${message?.content}`
                : message?.content}
            </p>
            {message?.delivered === 0 && message?.sender_id !== user?.id && (
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsCards;
