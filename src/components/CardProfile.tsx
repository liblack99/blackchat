import React from "react";

interface CardProps {
  username: string | undefined;
  profileImage: string | undefined;
}

const CardProfile: React.FC<CardProps> = ({username, profileImage}) => {
  return (
    <div className="w-[90%] flex items-center pl-3 gap-2 rounded-lg">
      <div className="w-20 h-20 border border-1 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
        <img
          src={profileImage}
          alt="Profile photo"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="font-extrabold text-2xl">{username}</h2>
    </div>
  );
};

export default CardProfile;
