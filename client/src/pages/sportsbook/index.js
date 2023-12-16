import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CardBody from "../../components/card";
import weatherImg from "../../assets/weather.png";
import plusImg from "../../assets/plusIcon.png";
import user1Img from "../../assets/user.png";
import user2Img from "../../assets/user2.png";
import user3Img from "../../assets/user3.png";
import axios from "axios";

const Sportsbook = () => {
  const [playerDataBase, setPlayerDataBase] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  console.log("res : ", playerDataBase);

  useEffect(() => {
    getDataBase();
    getGameHistory();
  }, []);

  const getDataBase = async () => {
    const res = await axios.get(
      `http://localhost:8080/player_data_landing_page`
    );
    setPlayerDataBase(res?.data);
    // console.log(res.data)
  };
  const getGameHistory = async () => {
    const res = await axios.get(`http://localhost:8080/game_landing_page `);
    setGameHistory(res?.data);
  };
  return (
    <div className="flex justify-around">
      {/* Game History  */}

      <div style={{ minWidth: "400px" }}>
        <div
          style={{ backgroundColor: "#0C49BE", color: "#fff" }}
          className="py-3 px-2  rounded-t-md"
        >
          <p>Game History</p>
        </div>

        <div style={{ maxHeight: "750px", overflowY: "auto" }}>
          <div style={{ height: "800px" }}>
            {gameHistory?.map((data) => {
              return (
                <CardBody
                  leagueName={data?.season}
                  teamA={data?.team}
                  teamB={data?.opponent}
                  game_date={data?.game_date}
                  cardAtext={"Team Score"}
                  cardBtext={"Opponent Score"}
                  cardAdata={data?.team_score}
                  cardBdata={data?.opp_score}
                />
              );
            })}
          </div>
        </div>
        {/* footer  */}
        <div
          style={{ backgroundColor: "#0C49BE", color: "#fff" }}
          className="py-3 px-2 flex justify-center rounded-b-md "
        >
          <Link to={"/game-history-1"}>
          <p className="font-extrabold text-2xl">See all games</p>
          </Link>
        </div>
      </div>

      {/*Player database  */}
      <div className="flex flex-col">
        <div style={{ minWidth: "400px" }}>
          <div
            style={{ backgroundColor: "#0C49BE", color: "#fff" }}
            className="py-3 px-2  rounded-t-md"
          >
            <p>Player Database</p>
          </div>
          {/* footer  */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <div style={{ height: "800px" }}>
              {playerDataBase?.map((data) => {
                return (
                  <CardBody
                    leagueName={data?.college}
                    teamA={data?.first_name + " " + data?.last_name}
                    teamB={data?.current_status}
                    cardAdata={data?.position}
                    cardBdata={data?.height}
                    cardCData={data?.weight}
                    userImg={user1Img}
                    playerdb={true}
                  />
                );
              })}
            </div>
          </div>

          <div
            style={{ backgroundColor: "#0C49BE", color: "#fff" }}
            className="py-3 px-2 flex justify-center  rounded-b-md"
          >
             <Link to={"/player-database-1"}>
            <p className="font-extrabold text-2xl">See all players</p>
            </Link>
          </div>
        </div>
        <div style={{ minWidth: "400px" }} className="my-8">
          <div
            style={{ backgroundColor: "#0C49BE", color: "#fff" }}
            className="py-3 px-2 rounded-t-md"
          >
            <p>Weather Insights</p>
          </div>
          <div style={{ border: "1px solid lightgray" }} className="p-4">
            <p class="pb-8 text-center">See how the weather affected past game results</p>{" "}
            <div className="flex flex-col justify-center items-center pb-4">
              <img src={weatherImg} />

            </div>
          </div>
          {/* footer  */}
          <div
            style={{ backgroundColor: "#0C49BE", color: "#fff" }}
            className="py-3 px-2 flex justify-center  rounded-b-md"
          >
            <Link to={"/weather_insight"}>
              <p className="font-extrabold text-2xl">See Insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sportsbook;
