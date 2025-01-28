import {RootState} from "../store/store";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {useRef} from "react";
import {getSocket} from "../utils/socket";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  createdAt: string;
}
interface PropsChat {
  handleClick: () => void;
  handleClickClose: () => void;
}

const Chat: React.FC<PropsChat> = ({handleClick, handleClickClose}) => {
  const {conversation} = useSelector((state: RootState) => state.messages);
  const {friendChatId, friends, status} = useSelector(
    (state: RootState) => state.friends
  );
  const {user} = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const socket = getSocket();
    if (socket) {
      const newMessage = {
        receiverId: friendChatId,
        content: messages,
      };
      socket.emit("sendMessage", newMessage);
    }
    setMessages("");
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentFriendId = friends.find(
    (friend) => friend.friend_id == friendChatId
  );

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <>
      {friendChatId !== 0 ? (
        <div className="w-full h-full flex flex-col relative border-x-2 border-gray-300">
          <div
            className=" w-full h-20 shadow-lg bg-white flex items-center gap-2 pl-4 border-b-2 "
            onClick={() => handleClick()}>
            <div className="w-12 h-12 rounded-full bg-[#e5e7eb] border border-1 overflow-hidden">
              {currentFriendId?.profileImage ? (
                <img
                  src={currentFriendId?.profileImage}
                  className="w-full h-full object-cover "
                  alt={`Profile photo ${currentFriendId?.username}`}
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
            <h2 className="font-bold text-2xl">{currentFriendId?.username}</h2>
            <div
              className={`${status ? "bg-green-400" : "bg-red-600"} 
              w-3 h-3 rounded-full`}></div>
          </div>
          <button
            className="absolute top-6 right-4"
            onClick={() => handleClickClose()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width={16}>
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
          </button>
          <div
            ref={chatContainerRef}
            className="bg-slate-100 flex-1 overflow-hidden overflow-y-scroll flex flex-col-reverse ">
            <ul className="flex flex-col gap-4 p-4 ">
              {conversation.map((msg: Message) => (
                <li
                  className={`${
                    msg.sender_id == user?.id
                      ? "self-end flex justify-center items-end gap-1"
                      : "self-start flex flex-row-reverse justify-center items-end gap-1"
                  }`}
                  key={msg.id}>
                  <p
                    className={`max-w-[80%] px-4 py-2  text-lg  ${
                      msg.sender_id == user?.id
                        ? "bg-black text-white  rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                        : "bg-gray-300 text-black rounded-tl-lg rounded-tr-lg rounded-br-lg"
                    }`}>
                    {msg.content}
                  </p>
                  <img
                    src={
                      msg.sender_id == user?.id
                        ? user.profileImage
                        : currentFriendId?.profileImage
                    }
                    className="w-8 rounded-full h-8 object-cover"
                    alt="foto de usuarios"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Formulario de entrada */}
          <form
            onSubmit={handleSubmit}
            className="w-full flex justify-center items-center p-2 bg-white">
            <textarea
              name="messages"
              className="flex-1 p-2 rounded-lg border-none  max-h-40 h-10 resize-none"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Escribe un mensaje..."
            />
            <button
              type="submit"
              className="bg-black text-white rounded-full w-12 h-12 flex justify-center items-center ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="white"
                width={24}>
                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width={180}
            fill="#e9e9e9">
            <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.8 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
          </svg>
        </div>
      )}
    </>
  );
};

export default Chat;
