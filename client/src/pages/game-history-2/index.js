import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GameHistory2.module.css'; 
import { useParams } from 'react-router-dom';


const GameHistory2 = ({ match }) => {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { team1, team2, date } = useParams();

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/game_history/${team1}/${team2}/${date}`);
        setGameData(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch game data');
        setGameData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [team1, team2, date]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
    <h1 className={styles.header}>Game History Details</h1>
    <div className={styles.playerStatsContainer}>
      {gameData.map((player, index) => (
        <div key={index} className={styles.playerCard}>
          <h2 className={styles.playerName}>{player.Player_Name}</h2> 
          <p className={styles.team}>Team: {player.team}</p>
          <p className={styles.position}>Position: {player.position}</p>
          <p className={styles.stats}>Passing/Receiving Yards: {player.passing_receiving_yards}</p>
          <p className={styles.stats}>Rushing Yards: {player.rushing_yards}</p>
          <p className={styles.stats}>Touchdowns: {player.touchdowns}</p>
        </div>
      ))}
    </div>
  </div>
);
};

export default GameHistory2;
