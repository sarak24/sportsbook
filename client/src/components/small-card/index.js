import React from "react";

import "./small.css";

const SmallCard = ({ icon, title, bg }) => {
  return (
    <div
      className="flex justify-center items-center p-2 px-4 mr-4 smallCardContailer "
      style={{ maxWidth: "180px" }}
    >
      <div>
        <div
          className="w-12 h-12 rounded-full  relative "
          style={{ background: bg }}
        >
          <img src={icon} width={70} className="absolute " />
        </div>
      </div>
      <span className="ml-2 text-xl font-extrabold">{title}</span>
    </div>
  );
};

export default SmallCard;
