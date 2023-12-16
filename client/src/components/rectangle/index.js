import React from "react";
import retangle from "../../assets/rectangle.png";

const Rectangle = ({ pic, temp, h, l, address, condition }) => {
  return (
    <div className="relative my-2">
      <img src={retangle} />
      <img src={pic} className="absolute right-0 -top-4" />
      <div className="absolute left-6 top-8  ">
        <h1 className="text-5xl font-extrabold text-white">{temp}</h1>
      </div>
      <div className="absolute bottom-11 left-6">
        <span style={{ color: "#92a7e3" }} className="mr-2">
          {h}
        </span>
        <span style={{ color: "#92a7e3" }}>{l}</span>
      </div>
      <p className="text-white text-xl absolute bottom-5 left-6">{address}</p>
      <p className="absolute bottom-5 right-6 text-white"> {condition}</p>
    </div>
  );
};

export default Rectangle;
