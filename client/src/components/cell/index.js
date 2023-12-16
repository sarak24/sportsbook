import React from "react";

const Cylender = ({ weatherSmallPic }) => {
  return (
    <div className="bg-blue-700 w-fit rounded-3xl py-4 px-2 flex flex-col justify-center items-center">
      <span className="text-white text-xs mb-4">12AM</span>
      <img src={weatherSmallPic} width={20} />
      <span className="text-xs text-blue-500 mt-1">30%</span>
      <span className="text-lg text-white mt-4 ">19</span>
    </div>
  );
};

export default Cylender;
