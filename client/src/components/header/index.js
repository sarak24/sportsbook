import React from "react";
import { Link, useLocation } from "react-router-dom";

import Inputt from "../input/inedx";

import rankingImg from "../../assets/ranking.png";
import dbImg from "../../assets/db.png";
import insightImg from "../../assets/insight.png";
import bettingImg from "../../assets/betting.png";
import backImg from "../../assets/backArrow.png";

import "./head.css";

const Header = () => {
  const { pathname } = useLocation();
  return (
    <div
      className="my-3 flex justify-between items-center  "
      style={{ padding: "20px", minHeight: "220px", background: "#fbfbfc" }}
    >
      <div className="flex  items-center ">
        <div className="flex flex-col mr-11">
          <div className="mb-3">
            {pathname === "/game-history-1" && (
               <div className="flex items-center">
               <Link to={"/"}>
                 <img src={backImg} className="mr-6" />
               </Link>
              <h1 className="text-2xl font-bold">Ranking Overview</h1>
              </div>
            )}
            {pathname === "/sportsbook" && (
              <h1 className="text-2xl font-bold">Welcome, Eric</h1>
            )}
             {pathname === "/weather_insight" && (
              <div className="flex items-center">
                <Link to={"/"}>
                  <img src={backImg} className="mr-6" />
                </Link>
                <h1 className="text-2xl font-bold">Weather Insights</h1>
              </div>
            )}
            {pathname === "/match_predictions" && (
              <div className="flex items-center">
                <Link to={"/"}>
                  <img src={backImg} className="mr-6" />
                </Link>
                <h1 className="text-2xl font-bold">
                  Predict the match!
                </h1>
              </div>
            )}
            {pathname === "/contributors" && (
              <div className="flex items-center">
                <Link to={"/"}>
                  <img src={backImg} className="mr-6" />
                </Link>
                <h1 className="text-2xl font-bold">
                  Look at Which Players Made the Biggest Contributions!
                </h1>
              </div>
            )}
              {pathname.startsWith("/game-history-2") && (
    <div className="flex items-center">
      <Link to={"/game-history-1"}>
        <img src={backImg} className="mr-6" />
      </Link>
      <h1 className="text-2xl font-bold">
        Specific Game Details
      </h1>
    </div>
  )}
              {pathname.startsWith("/player-database-2") && (
                <div className="flex items-center">
                  <Link to={"/player-database-1"}>
                    <img src={backImg} className="mr-6" />
                  </Link>
                  <h1 className="text-2xl font-bold">
                    Look at the teammates of specific player!
                  </h1>
                </div>
              )}
             {pathname === "/playercomparison" && (
              <div className="flex items-center">
                <Link to={"/"}>
                  <img src={backImg} className="mr-6" />
                </Link>
                <h1 className="text-2xl font-bold">
                  Compare two players!
                </h1>
              </div>
            )}
            {pathname === "/player-database-1" && (
              <div className="flex items-center">
                <Link to={"/"}>
                  <img src={backImg} className="mr-6" />
                </Link>
                <h1 className="text-2xl font-bold">
                  Find the player!
                </h1>
              </div>
            )}
            {pathname === "/userProfile" && (
              <div className="flex items-center">
                <Link to={"/"}>
                  <img src={backImg} className="mr-6" />
                </Link>
                <h1 className="text-2xl font-bold">User Profile</h1>
              </div>
            )}
          </div>
          <div className="flex">
            <Link to={"/playercomparison"}>
              <div
                className="cardShadow p-2 rounded-lg mr-2 "
                style={{
                  border:
                  pathname === "/playercomparison" ? "4px solid blue" : "4px  solid white",
                }}
              >
                <img src={rankingImg} width={40} />
                <span className="text-lg font-bold">Head to Head</span>
              </div>
            </Link>

            <Link to={"/contributors"}>
              <div
                className="cardShadow p-2 rounded-lg mr-2 "
                style={{
                  border:
                  pathname === "/contributors" ? "4px solid blue" : "4px  solid white",
                }}
              >
                <img src={insightImg} width={40} />
                <span className="text-lg font-bold">Contributors</span>
              </div>
            </Link>
            <Link to={"/match_predictions"}>
              <div
                className="cardShadow p-2 rounded-lg mr-2 "
                style={{
                  border:
                  pathname === "/match_predictions"
                      ? "4px solid blue"
                      : "4px  solid white",
                }}
              >
                <img src={bettingImg} width={40} />
                <span className="text-lg font-bold">Predictions</span>
              </div>
            </Link>
          </div>
        </div>
        {/* <div className="ml-10">
          <Inputt />
        </div> */}
      </div>
      {(pathname === "/" || pathname === "betting") && (
        <div>
       </div>
      )}
    </div>
  );
};

export default Header;
