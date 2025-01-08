import React from "react";

type Props = {
  children: React.ReactNode; // Tipo para children
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Button: React.FC<Props> = ({children, onClick}) => {
  return (
    <button
      onClick={onClick}
      className="border-2 border-black rounded-md w-20 text-center  ">
      {children}
    </button>
  );
};

export default Button;
