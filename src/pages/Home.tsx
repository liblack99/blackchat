import React from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import {AppDispatch} from "../store/store";
import {useEffect} from "react";
import {fetchUserData} from "../slices/authSlice";
import {useDispatch} from "react-redux";
import {
  setStatus,
  setFriendChatId,
  fetchFriends,
  fetchPendingRequests,
  setPendingRequests,
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
import UpdateUserForm from "../components/UpdateUserForm";

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("friends");
  const [searchFriend, setSearchFriend] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const {user, loading, token} = useSelector((state: RootState) => state.auth);

  const {friendChatId, friends} = useSelector(
    (state: RootState) => state.friends
  );

  useEffect(() => {
    if (!token || !user) return;

    const socket = initializeSocket(token);

    // Emitir el evento para verificar la conexión del usuario
    socket.emit("checkUserConnection", friendChatId);

    // Escuchar eventos del servidor
    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("userConnectionStatus", (isConnected) => {
      dispatch(setStatus(isConnected));
    });

    socket.on("messageSent", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("request", (pendingRequests) => {
      dispatch(setPendingRequests(pendingRequests));
    });
  }, [user, friendChatId, token]);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchFriends(user?.id));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchPendingRequests(user?.id));
  }, [user]);

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
  const handleFormClick = () => {
    setActiveSection("friends");
  };
  const handleEditClick = () => {
    setActiveSection("update");
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center bg-white">
        <p className="text-4xl">cargando...</p>
      </div>
    );
  }
  const filterFriend = friends.filter((friend) =>
    friend.username
      .toLowerCase()
      .includes(searchFriend.toLocaleLowerCase().trim())
  );

  return (
    <>
      <Header />
      <main className="flex h-[calc(100vh-60px)] w-full relative">
        {/* Sección de Amigos */}
        <Section
          className={`w-full h-full   ${
            activeSection === "update" ? "block animate-fadeInUp " : "hidden"
          }  animate-fadeInUp`}>
          <Aside>
            <UpdateUserForm handleFormClick={handleFormClick} />
          </Aside>
        </Section>
        <Section
          className={`w-full h-full ${
            activeSection === "friends" ? "block animate-fadeInUp " : "hidden "
          }  ${
            activeSection === "update" ? "lg:hidden" : "lg:block"
          }  animate-fadeInUp`}>
          <Aside>
            <div className="w-[90%] relative justify-center items-center shadow-sm p-2">
              <CardProfile
                username={user?.username}
                profileImage={user?.profileImage}
              />
              <button
                className="absolute right-2 top-4 "
                onClick={() => handleEditClick()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width={24}>
                  <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                </svg>
              </button>
            </div>
            <SearchFriends
              onChangeName={(e) => setSearchFriend(e.target.value.trim())}
            />
            {friends.length === 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-4 shadow-sm">
                <p className="text-center text-4xl font-bold">
                  No tienes amigos
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-2 items-center overflow-hidden overflow-y-scroll shadow p-4 ">
                {filterFriend.map((friend) => (
                  <FriendsCards
                    key={friend.id}
                    friend_id={friend.friend_id}
                    profileImage={friend.profileImage}
                    username={friend.username}
                    handleClick={handleFriendClick}
                  />
                ))}
              </div>
            )}
          </Aside>
        </Section>
        <Section
          className={`h-full w-full  ${
            activeSection === "chat" ? "block animate-fadeInLeft" : "hidden"
          } lg:block lg:animate-fadeInUp`}>
          <Chat
            handleClick={handleProfileClick}
            handleClickClose={handleClickClose}
          />
        </Section>
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
