import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
const CardProfile: React.FC = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-[90%] flex items-center pl-3 gap-2">
      <div className="w-20 h-20 border border-1 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
        <img
          src={user?.profileImage}
          alt="foto"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="font-extrabold text-2xl">
        {user?.username ? user.username : "Andres felipe"}
      </h2>
    </div>
  );
};

export default CardProfile;
