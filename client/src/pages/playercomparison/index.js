import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';



const PlayerComparison = () => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [countResult, setCountResult] = useState([]);
  const [connectionsResult, setConnectionsResult] = useState([]);
  const [baconResult, setBaconResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [winner, setWinner] = useState(null);


  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/player_names');
        setPlayers(response.data.map(player => ({ label: `${player.first_name} ${player.last_name}`, ...player })));
      } catch (err) {
        console.error('Failed to fetch players:', err);
      }
    };
    fetchPlayers();
  }, []);

  const fetchComparison = async () => {
    if (!player1 || !player2 || (player1.label === player2.label)) {
      setError('Please enter two different teams to get the prediction.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8080/player_comparison_games/${player1.first_name}/${player1.last_name}/${player2.first_name}/${player2.last_name}`);
      if (response.data && response.data.length > 0 && response.data[0] != "N") {
        setComparisonResult(response.data[0]);
        console.log('API Response 1:', response.data[0]); 
      } else {
        setError('No games were found between these two players.');
        setComparisonResult(null);
      }
    } catch (err) {
      setError(err.response?.data || 'Two players never played against each other.');
    }
    setLoading(false);
  };

  const fetchCount = async () => {
    if (!player1 || !player2 || (player1.label === player2.label)) {
      setError('Please enter two different players to compare.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/player_comparison/${player1.first_name}/${player1.last_name}/${player2.first_name}/${player2.last_name}`);
      console.log('API Response 3:', response.data); 
      setCountResult(response.data);
      const winnerIsPlayer1 = parseInt(response.data[0].win_count) > parseInt(response.data[0].loss_count);
      setWinner(winnerIsPlayer1 ? player1 : player2);
    } catch (err) {
      setError(err.response?.data || 'Two players never played against each other.');
    }
    setLoading(false);
    
  };

  const fetchBacon = async () => {
    if (!player1 || !player2 || (player1.label === player2.label)) {
      setError('Please enter two different players to compare.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/bacon/${player1.first_name}/${player1.last_name}/${player2.first_name}/${player2.last_name}`);
      console.log('API Response 4:', response.data);
      setBaconResult(response.data);
    } catch (err) {
      setError(err.response?.data || 'Two players never played against each other.');
    }
    setLoading(false);
    
  };

  const fetchConnections = async () => {
    if (!player1 || !player2 || (player1.label === player2.label)) {
      setError('Please enter two different players to compare.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/connections/${player1.first_name}/${player1.last_name}/${player2.first_name}/${player2.last_name}`);
      setConnectionsResult(response.data);
      console.log('API Response 2:', response.data); 
    } catch (err) {
      setError(err.response?.data || 'Two players never played against each other.');
    }
    setLoading(false);
  };

  const fetchAllData = async () => {

    setLoading(true);

    try {
      console.log('fetching all data 1'); 
      await fetchComparison();
      console.log('fetching all data 2'); 
      await fetchCount();
      console.log('fetching all data 3'); 
      await fetchConnections();
      console.log('fetching all data 4'); 
      await fetchBacon();
    } catch (err) {
      console.error('Error during fetching:', err);
      setError('Two players never played against each other.');
    }

    setLoading(false);
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Autocomplete
          options={players}
          getOptionLabel={(option) => option.label}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="First Player" variant="outlined" />}
          onChange={(_, newValue) => setPlayer1(newValue)}
          disableClearable
        />
        <div style={{ margin: '0 10px' }}></div>
        <Autocomplete
          options={players}
          getOptionLabel={(option) => option.label}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Second Player" variant="outlined" />}
          onChange={(_, newValue) => setPlayer2(newValue)}
          disableClearable
        />
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#0C49BE' }}>
        <Button
          variant="contained"
          onClick={fetchAllData}
          disabled={loading || !player1 || !player2}
        >
          {loading ? 'Loading...' : 'Compare Players'}
        </Button>
      </Box>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {error !== 'No games were found between these two players.' && comparisonResult && (
      <Card variant="outlined" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        borderColor: '#0C49BE',
        borderWidth: '0px', 
        overflow: 'hidden' 
      }}>
       <CardContent style={{ textAlign: 'center', fontWeight: 'bold' }}>
         <Box mt={2} py={2} px={3} bgcolor="gold" color="black" boxShadow={3} borderRadius={5} style={{ display: 'inline-block' }}>
        <Typography variant="h4" component="span">
        🏆 Winner: {winner ? winner.label : "Determining..."} 🏆
        </Typography>
        {winner && countResult && (
        <Typography variant="h6" component="div" style={{ marginTop: '8px' }}>
            {winner.label} beat <b> {winner === player1 ? player2.label : player1.label} {winner === player1 ? countResult[0].win_count : countResult[0].loss_count} </b>times.
        </Typography>
        )}
         {comparisonResult.season && (
          <Typography variant="h6" component="div" style={{ marginTop: '8px' }}>
            Last game played together was during the <b>{comparisonResult.season}</b>.
          </Typography>
        )}
         {comparisonResult.team_score && comparisonResult.opp_score && (
          <Typography variant="h6" component="div" style={{ marginTop: '8px' }}>
            Latest game result: {player2.label} <b>{comparisonResult.team_score} - {comparisonResult.opp_score} </b>{player1.label}
          </Typography>
        )}
        {connectionsResult.length > 0 ? (
          <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={5}>
            <Typography variant="h6" gutterBottom component="div">
              Connections:
            </Typography>
            {connectionsResult.slice(0, 3).map((connection, index) => (
              <Typography key={index} variant="body1" component="p" style={{ marginBottom: '8px' }}>
                {`${connection.first_name} ${connection.last_name}, Team: ${connection.team}, Overlapped Years: ${connection.years_overlap}, Same Position: ${connection.same_position}`}
              </Typography>
            ))}
          </Box>
        ) : (
          <Box mt={2} py={2} px={3} bgcolor="yellow" color="black" boxShadow={3} borderRadius={5} style={{ display: 'inline-block' }}>
            <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>
              They were not teammates.
            </Typography>
          </Box>
        )}
      {baconResult.length > 2 && (
  <Box mt={1} p={1} bgcolor="#FFFF00" borderRadius={5} boxShadow={3} sx={{
    maxWidth: '200px',
    marginLeft: 'auto', 
    marginRight: 'auto'
    }}>
    <Typography variant="h6" gutterBottom component="div">
        Shortest path in between:
    </Typography>
    <Typography variant="body1" component="p">
      {baconResult.slice(1, -1).map((connection, index) => (
        <React.Fragment key={index}>
          {connection.name}{index < baconResult.length - 3 ? ', ' : ''}
        </React.Fragment>
      ))}
    </Typography>
  </Box>
)}
  </Box>
       </CardContent>
     </Card>
      )}
    </Box>
  );
};

export default PlayerComparison;
