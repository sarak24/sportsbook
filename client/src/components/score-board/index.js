import React from "react";
import "./score.css";

import citylogo from "../../assets/cityLogo.png";
import img1 from "../../assets/img1.png";
import img3 from "../../assets/img2.png";
import img4 from "../../assets/img3.png";
import img5 from "../../assets/img4.png";

const ScoreBoard = () => {
  return (
    <div
      className="scoreContailer bg-red-600 p-4 flex flex-col mr-6 mb-4"
      style={{ minWidth: "353px" }}
    >
      <p className="flex justify-end  text-blue-600 font-extrabold  ">
        See All
      </p>
      <p>B League</p>
      <div className="flex flex-col">
        <div className="my-4 flex items-center">
          <img src={img1} width={30} />
          <div
            className="flex justify-between  pb-2 ml-2 px-3  text-xs  "
            style={{ minWidth: "250px", borderBottom: "2px solid #2E2F3E" }}
          >
            <span>Buffalo Bills</span>
            <span>3</span>
            <span>0</span>
            <span>0</span>
            <span>9</span>
          </div>
        </div>
        <div className="my-4 flex items-center">
          <img src={citylogo} width={30} />
          <div
            className="flex justify-between  pb-2 ml-2 px-3  text-xs  "
            style={{ minWidth: "250px", borderBottom: "2px solid #2E2F3E" }}
          >
            <span>Ny Jets</span>
            <span>3</span>
            <span>0</span>
            <span>0</span>
            <span>9</span>
          </div>
        </div>
        <div className="my-4 flex items-center">
          <img src={img3} width={30} />
          <div
            className="flex justify-between  pb-2 ml-2 px-3  text-xs  "
            style={{ minWidth: "250px", borderBottom: "2px solid #2E2F3E" }}
          >
            <span>My Team 1</span>
            <span>3</span>
            <span>0</span>
            <span>0</span>
            <span>9</span>
          </div>
        </div>
        <div className="my-4 flex items-center">
          <img src={img4} width={30} />
          <div
            className="flex justify-between  pb-2 ml-2 px-3  text-xs  "
            style={{ minWidth: "250px", borderBottom: "2px solid #2E2F3E" }}
          >
            <span>My Team 2</span>
            <span>3</span>
            <span>0</span>
            <span>0</span>
            <span>9</span>
          </div>
        </div>
        <div className="my-4 flex items-center">
          <img src={img5} width={30} />
          <div
            className="flex justify-between  pb-2 ml-2 px-3  text-xs  "
            style={{ minWidth: "250px", borderBottom: "2px solid #2E2F3E" }}
          >
            <span>My Team 3</span>
            <span>3</span>
            <span>0</span>
            <span>0</span>
            <span>9</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
