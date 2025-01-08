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
  }, [conversation]);

  return (
    <div
      className="w-full border-b-2 border-gray-400 py-2 cursor-pointer hover:bg-gray-100"
      onClick={() => handleCardClick(friend_id)}>
      <div className="flex items-center pl-3 gap-2">
        <div className="w-20 h-20 border border-1 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
          <img
            src={profileImage}
            alt="foto"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-extrabold text-2xl">{username}</h2>
          <div className="flex justify-between items-center">
            <p className="text-md text-gray-600 min-h-[24px]">
              {message?.sender_id === user?.id
                ? `You:${message?.content} `
                : message?.content}
            </p>
            {message?.delivered === 0 &&
              message.sender_id === user?.id &&
              undefined}
            {message?.delivered === 0 && message.sender_id !== user?.id && (
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsCards;
