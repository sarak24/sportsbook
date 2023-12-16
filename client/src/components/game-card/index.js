import React from "react";
import cityLogo from "../../assets/cityLogo.png";

const GameCardComponent = ({ img1, img2, score, bg, customMarginRight }) => {
  return (
    <div
      className="py-4 px-6 flex justify-between rounded-md  customClass"
      style={{
        backgroundColor: "rgba(69, 104, 220, 1), rgba(140, 154, 191, 1)",
        maxWidth: "250px",
        marginRight: customMarginRight,
        minWidth: "300px",
      }}
    >
      <div className="flex flex-col">
        <img src={img1} width={70} />
        <div className="text-xs flex flex-col text-white mt-5 ">
          <span>xxxx xxxx #10</span>
          <span>xxxx xxxx #04</span>
        </div>
      </div>
      <div className="flex flex-col text-white justify-center ">
        <span>60 : 22</span>
        <span className="font-extrabold text-2xl mt-4 ">{score}</span>
      </div>
      <div className="flex flex-col">
        <img src={img2} width={70} />
        <div className="text-xs flex flex-col text-white mt-5 ">
          <span>xxxx xxxx #10</span>
        </div>
      </div>
    </div>
  );
};

export default GameCardComponent;
