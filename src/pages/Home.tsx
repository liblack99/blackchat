import React from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import {AppDispatch} from "../store/store";
import {useEffect} from "react";
import {fetchUserData} from "../slices/authSlice";
import {useDispatch} from "react-redux";
import {
  fetchPendingRequests,
  fetchFriends,
  setStatus,
  setFriendChatId,
} from "../slices/friendsSlice";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import Section from "../components/Section";
import {initializeSocket} from "../utils/socket";
import {addMessage} from "../slices/messagesSlice";
import CardProfile from "../components/CardProfile";
import SearchFriends from "../components/SearchFriends";
import FriendsCards from "../components/FriendsCards";
import Chat from "../components/Chat";
import ProfileFriends from "../components/ProfileFriends";
import {useState} from "react";

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("friends");
  const dispatch = useDispatch<AppDispatch>();
  const {user, loading, token} = useSelector((state: RootState) => state.auth);

  const {pendingRequests, friendChatId, friends} = useSelector(
    (state: RootState) => state.friends
  );

  useEffect(() => {
    if (!token || !user) return;
    const socket = initializeSocket(token);

    socket.emit("checkUserConnection", friendChatId);

    socket.on("userConnectionStatus", (isConnected) => {
      dispatch(setStatus(isConnected));
    });

    socket.on("messageSent", (message) => {
      console.log(message);
      dispatch(addMessage(message));
    });
  }, [user, friends, friendChatId]);

  useEffect(() => {
    dispatch(fetchUserData()); // Llamar a la acción para obtener los datos del usuario
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchPendingRequests(user?.id));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchFriends(user?.id));
  }, [user, pendingRequests]);

  const profileCurrentFRiend = friends.find(
    (friend) => friend.friend_id === friendChatId
  );

  const handleFriendClick = () => {
    setActiveSection("chat");
  };

  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  const handleClickClose = () => {
    setActiveSection("friends");
    dispatch(setFriendChatId(0));
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center bg-white">
        <p className="text-4xl">cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex h-[calc(100vh-60px)] w-full">
        {/* Sección de Amigos */}
        <Section
          className={`w-full h-full ${
            activeSection === "friends" ? "block animate-fadeInUp " : "hidden"
          } lg:block animate-fadeInUp`}>
          <Aside>
            <CardProfile />
            <SearchFriends />
            {friends.length === 0 && (
              <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                <p className="text-center text-4xl font-bold">
                  No tienes amigos
                </p>
              </div>
            )}
            <div className="w-full flex flex-col gap-2  items-center">
              {friends.map((friend) => (
                <div key={friend.id} className="cursor-pointer w-[90%]">
                  <FriendsCards
                    friend_id={friend.friend_id}
                    profileImage={friend.profileImage}
                    username={friend.username}
                    handleClick={handleFriendClick}
                  />
                </div>
              ))}
            </div>
          </Aside>
        </Section>

        {/* Sección de Chat */}
        <Section
          className={`h-full w-full  ${
            activeSection === "chat" ? "block animate-fadeInLeft" : "hidden"
          } lg:block lg:animate-fadeInUp`}>
          <Chat
            handleClick={handleProfileClick}
            handleClickClose={handleClickClose}
          />
        </Section>

        {/* Sección de Perfil del Amigo */}
        <Section
          className={`w-full h-full lg:block lg:animate-fadeInUp ${
            activeSection === "profile" ? "block animate-fadeInLeft" : "hidden"
          }`}>
          <Aside>
            {friendChatId === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  height={120}
                  width={120}
                  fill="white">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                </svg>
              </div>
            ) : (
              <ProfileFriends
                profileImage={profileCurrentFRiend?.profileImage}
                username={profileCurrentFRiend?.username}
                handleClick={handleFriendClick}
              />
            )}
          </Aside>
        </Section>
      </main>
    </>
  );
};

export default Home;
