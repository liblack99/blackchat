import React, {ReactNode} from "react";

interface AsideProps {
  children?: ReactNode;
}

const Aside: React.FC<AsideProps> = ({children}) => {
  return (
    <div className="w-full h-full pt-4 border-r border-1 shadow-sm flex flex-col items-center gap-8 bg-slate-100">
      {children}
    </div>
  );
};

export default Aside;
