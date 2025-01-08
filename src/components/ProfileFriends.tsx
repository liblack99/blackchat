import React from "react";

interface Friend {
  username: string | undefined;
  profileImage: string | undefined;
  handleClick: () => void;
}

const ProfileFriends: React.FC<Friend> = ({
  username,
  profileImage,
  handleClick,
}) => {
  return (
    <div className="flex w-full h-full justify-start items-center flex-col gap-6 relative">
      <button
        className="text-4xl font-bold  absolute top-4 left-4 flex justify-center items-center gap-2 lg:hidden"
        onClick={() => handleClick()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width={18}>
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
        <p className="text-sm">Back</p>
      </button>
      <img
        src={profileImage}
        alt={`photo de perfil ${username}`}
        className="w-60 h-60 rounded-full mt-24 object-cover"
      />
      <h2 className="text-6xl">{username}</h2>
    </div>
  );
};

export default ProfileFriends;
