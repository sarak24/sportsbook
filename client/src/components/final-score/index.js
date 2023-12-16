import React from "react";

import leftArrow from "../../assets/leftArrow.png";
import infoArrow from "../../assets/info.png";
import cityIcon from "../../assets/cityLogo.png";
import img1 from "../../assets/img1.png";

const FinalScore = () => {
  return (
    <div className="flex flex-col ml-8">
      <div className="p-4 bg-blue-700 rounded-t-md flex justify-center text-white">
        x VS. x
      </div>
      <div className="flex justify-between items-center mt-4">
        <img src={leftArrow} />
        <span className="font-extrabold">Final Score</span>
        <img src={infoArrow} />
      </div>
      <p className="flex justify-center text-xs text-blue-600 mt-8">
        Full Time
      </p>
      <div className="flex justify-around items-center mt-4">
        <img src={img1} width={70} />
        <span className="font-extrabold text-3xl">2 - 1</span>
        <img src={cityIcon} width={70} />
      </div>
      <div className="flex justify-between my-6">
        <div className="flex flex-col">
          <span>Samuel#10</span>
          <span>Samuel#10</span>
        </div>
        <span>Samuel#10</span>
      </div>
      <p className="flex justify-center font-bold mb-2">Statistic Match</p>
      <div className="flex justify-between">
        <span className="font-bold">11</span>
        <span>Shoot</span>
        <span className="font-bold"> 16</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">7</span>
        <span>Shoot on Target</span>
        <span className="font-bold"> 8</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">48%</span>
        <span>Ball Possession</span>
        <span className="font-bold"> 52%</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">500</span>
        <span>Pass</span>
        <span className="font-bold"> 532</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">89%</span>
        <span>Pass Accuracy</span>
        <span className="font-bold"> 90%</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">7</span>
        <span>Foul</span>
        <span className="font-bold"> 13</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">0</span>
        <span>Yellow Card</span>
        <span className="font-bold"> 1</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">0</span>
        <span>Red Card</span>
        <span className="font-bold"> 0</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">1</span>
        <span>Offside</span>
        <span className="font-bold">5</span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">3</span>
        <span>Corner Kick</span>
        <span className="font-bold">2</span>
      </div>
      <div className="p-4 mt-3 bg-blue-700 rounded-b-md -md flex justify-center text-white">
        See More
      </div>
    </div>
  );
};

export default FinalScore;
