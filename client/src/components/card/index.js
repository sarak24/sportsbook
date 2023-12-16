import React from "react";
import firstIcon from "../../assets/1stLogo.png";
import moment from "moment";


const CardBody = ({
  playerdb,
  leagueName,
  teamA,
  teamB,
  userImg,
  game_date,
  cardAtext,
  cardBtext,
  cardAdata,
  cardBdata,
  cardCData,
}) => {

  return (
    <div style={{ border: "1px solid lightgray", backgroundColor: "gray" }}>
      <div
        className="flex flex-col px-2 py-3"
        style={{
          background: "#fff",
          borderBottom: "6px solid lightgray",
          minWidth: "450px",
        }}
      >
        <div className="flex justify-between ">
          <div className="flex items-center">
            <span
              className="text-base  font-medium"
              style={{ color: "#797d86" }}
            >
              {leagueName}
            </span>
          </div>
          {!playerdb && (
            <span className="text-xs" style={{ color: "#10AB61" }}>
             {game_date ? moment(game_date).format("YYYY-MM-DD") : game_date}
             
            </span>
          )}
        </div>
        <div className="flex justify-between my-4 ">
          <div className="flex items-center">
            <div>
              <p className="text-sm">{teamA}</p>
              <p className="text-sm mt-1">{teamB}</p>
            </div>
          </div>
          <div className="flex">
            <div
              className="rounded-lg mr-2 flex flex-col justify-center items-center "
              style={{ minWidth: "100px", backgroundColor: "lightgray" }}
            >
              <span className="text-xs text-gray-500">
                {cardAtext || "Position"}
              </span>
              <h1 className="text-base font-bold ">{cardAdata || "null"}</h1>
            </div>
            <div
              className="rounded-lg mr-2 flex flex-col justify-center items-center "
              style={{ minWidth: "100px", backgroundColor: "lightgray" }}
            >
              <span className="text-xs text-gray-500">
                {cardBtext || "Height"}
              </span>
              <h1 className="text-base font-bold ">{cardBdata || "null"}</h1>
            </div>
            {playerdb && (
              <div
                className="rounded-lg mr-2 flex flex-col justify-center items-center "
                style={{ minWidth: "100px", backgroundColor: "lightgray" }}
              >
                <span className="text-xs text-gray-500">Weight</span>
                <h1 className="text-base font-bold ">{cardCData || "null"}</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBody;
