import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PlayerDatabase2.module.css'; 
import { useParams } from 'react-router-dom';


const PlayerDatabase2 = ({ match }) => {
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { first_name, last_name } = useParams();

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/teammates/${first_name}/${last_name}`);
        const processedData = response.data.map(player => {
            const distinctTeams = Array.from(new Set(player.teams.split(','))).join(',');
            return {...player, teams: distinctTeams};
          });
        setPlayerData(processedData);
        setError('');
      } catch (err) {
        setError('Failed to fetch teammates data');
        setPlayerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [first_name, last_name]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
    <h1 className={styles.header}>Teammates of {first_name} {last_name}</h1>
    <div className={styles.playerStatsContainer}>
      {playerData.map((player, index) => (
        <div key={index} className={styles.playerCard}>
          <h2 className={styles.playerName}>{player.first_name} {player.last_name}</h2> 
          <p className={styles.team}>Years: {player.years}</p>
          <p className={styles.position}>Teams: {player.teams}</p>
          <p className={styles.stats}>Degree of connection: {player.degree}</p>
        </div>
      ))}
    </div>
  </div>
);
};

export default PlayerDatabase2;

