import React from "react";
import smallBorder from "../../assets/smallLine.png";
import weatherSmallPic from "../../assets/pic.png";
import Cylender from "../cell";

const Weather = () => {
  return (
    <div className="flex justify-center">
      <div
        className="p-6 border border-gray-400 border-dotted h-fit mt-6 rounded-md "
        style={{ minWidth: "500px" }}
      >
        <div
          className=" bg-weather_bg py-5 rounded-xl flex flex-col "
          style={{ maxWidth: "500px" }}
        >
          <div className="text-center flex justify-center ">
            <img src={smallBorder} width={30} />
          </div>
          <div className=" border-b border-gray-400  flex justify-between mt-6 text-white text-sm">
            <p className="pl-2">Hourly Forecast</p>
            <p className="pr-2">Hourly Forecast</p>
          </div>
          <div className="mt-10 flex justify-around">
            <Cylender weatherSmallPic={weatherSmallPic} />
            <Cylender weatherSmallPic={weatherSmallPic} />
            <Cylender weatherSmallPic={weatherSmallPic} />
            <Cylender weatherSmallPic={weatherSmallPic} />
            <Cylender weatherSmallPic={weatherSmallPic} />
            <Cylender weatherSmallPic={weatherSmallPic} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
