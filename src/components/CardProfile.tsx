import React from "react";

interface CardProps {
  username: string | undefined;
  profileImage: string | undefined;
}

const CardProfile: React.FC<CardProps> = ({username, profileImage}) => {
  return (
    <div className="w-[90%] flex items-center pl-3 gap-2 rounded-lg">
      <div className="w-20 h-20 border border-1 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              height={52}
              fill="white">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
            </svg>
          </div>
        )}
      </div>
      <h2 className="font-extrabold text-xl">{username}</h2>
    </div>
  );
};

export default CardProfile;
