import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSocket, initializeSocket} from "../utils/socket";
import {RootState, AppDispatch} from "../store/store";
import {
  addMessage,
  setConversation,
  setPendingMessages,
} from "../slices/messagesSlice";

const useChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {token, user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token || !user) return;

    const socket = initializeSocket(token);

    socket.on("receiveMessage", (message) => {
      console.log(message);
      dispatch(addMessage(message));
    });

    socket.emit("fetchPendingMessages");

    socket.on("pendingMessages", (messages) => {
      dispatch(setPendingMessages(messages));
    });
    socket.on("messageSent", (sentMessage) => {
      console.log(sentMessage);
      dispatch(addMessage(sentMessage));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch, token]);

  const fetchConversation = (otherUserId: number) => {
    const socket = getSocket();
    if (socket && user) {
      socket.emit("fetchConversation", {userId: user.id, otherUserId});

      socket.on("conversationData", (messages) => {
        dispatch(setConversation(messages));
      });
    }
  };

  const sendMessage = (receiverId: number, content: string) => {
    const socket = getSocket();
    if (socket && user) {
      const newMessage = {
        senderId: user.id,
        receiverId,
        content,
      };

      socket.emit("sendMessage", newMessage);
    }
  };

  return {fetchConversation, sendMessage};
};

export default useChat;
