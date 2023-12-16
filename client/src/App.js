import { Route, Routes } from "react-router-dom";
import React from 'react';
import Navbar from "./components/nav-bar";
import style from "./app.module.scss";
import Header from "./components/header";
import Sportsbook from "./pages/sportsbook";
import WeatherComponent from "./pages/weather-insight";
import UserProfile from "./pages/profile";
import MatchPredictions from "./pages/match-predictions";
import PlayerDatabase1 from "./pages/player-database-1";
import Contributors from "./pages/contributors";
import PlayerDatabase2 from "./pages/player-database-2";
import GameHistory1 from "./pages/game-history-1";
import GameHistory2 from "./pages/game-history-2";
import PlayerComparison from "./pages/playercomparison";

function App() {
  return (
    <>
      <div className={style.container}>
        <Navbar />
        <Header />
        <div style={{ padding: "0px 15px" }}>
          <Routes>
            <Route path="/" exact element={<Sportsbook />} />
            <Route path="/weather_insight" element={<WeatherComponent />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/match_predictions" element={<MatchPredictions />} />
            <Route path="/player-database-1" element={<PlayerDatabase1 />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/playercomparison" element={<PlayerComparison />} />
            <Route path="/player-database-2/:first_name/:last_name" element={<PlayerDatabase2 />} />
            <Route path="/game-history-1" element={<GameHistory1 />} />
            <Route path="/game-history-2/:team1/:team2/:date" element={<GameHistory2 />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
