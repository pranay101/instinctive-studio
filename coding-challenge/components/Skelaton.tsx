import React from "react";

interface SkelatonProps {}

const Skelaton: React.FC<SkelatonProps> = () => {
  return (
    <div className="flex max-w-[312px] h-[400px] flex-col gap-4 bg-white border border-gray-200 rounded-lg w-full p-6 animate-pulse">
      <div className="skeleton h-32 w-full bg-gray-100"></div>
      <div className="skeleton h-4 w-28 bg-gray-100"></div>
      <div className="skeleton h-4 w-full bg-gray-100"></div>
      <div className="skeleton h-4 w-full bg-gray-100"></div>
      <div className="skeleton h-4 w-full bg-gray-100"></div>
      <div className="skeleton h-4 w-full bg-gray-100"></div>
    </div>
  );
};

export default Skelaton;
