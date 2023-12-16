import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ArizonaCardinals from "../../teamLogos/arizona-cardinals-logo.png";
import AtlantaFalcons from "../../teamLogos/atlanta-falcons-logo.png";
import BaltimoreRavens from "../../teamLogos/baltimore-ravens-logo.png";
import BuffaloBills from "../../teamLogos/buffalo-bills-logo.png";
import CarolinaPanthers from "../../teamLogos/carolina-panthers-logo.png";
import ChicagoBears from "../../teamLogos/chicago-bears-logo.png";
import CincinnatiBengals from "../../teamLogos/cincinnati-bengals-logo.png";
import ClevelandBrowns from "../../teamLogos/cleveland-browns-logo.png";
import DallasCowboys from "../../teamLogos/dallas-cowboys-logo.png";
import DenverBroncos from "../../teamLogos/denver-broncos-logo.png";
import DetroitLions from "../../teamLogos/detroit-lions-logo.png";
import GreenBayPackers from "../../teamLogos/green-bay-packers-logo.png";
import HoustonTexans from "../../teamLogos/houston-texans-logo.png";
import IndianapolisColts from "../../teamLogos/indianapolis-colts-logo.png";
import JacksonvilleJaguars from "../../teamLogos/jacksonville-jaguars-logo.png";
import KansasCityChiefs from "../../teamLogos/kansas-city-chiefs-logo.png";
import LasVegasRaiders from "../../teamLogos/las-vegas-raiders-logo.png";
import LosAngelesChargers from "../../teamLogos/los-angeles-chargers-logo.png";
import LosAngelesRams from "../../teamLogos/los-angeles-rams-logo.png";
import MiamiDolphins from "../../teamLogos/miami-dolphins-logo.png";
import MinnesotaVikings from "../../teamLogos/minnesota-vikings-logo.png";
import NewEnglandPatriots from "../../teamLogos/new-england-patriots-logo.png";
import NewOrleansSaints from "../../teamLogos/new-orleans-saints-logo.png";
import NewYorkGiants from "../../teamLogos/new-york-giants-logo.png";
import NewYorkJets from "../../teamLogos/new-york-jets-logo.png";
import PhiladelphiaEagles from "../../teamLogos/philadelphia-eagles-logo.png";
import PittsburghSteelers from "../../teamLogos/pittsburgh-steelers-logo.png";
import SanFrancisco49ers from "../../teamLogos/san-francisco-49ers-logo.png";
import SeattleSeahawks from "../../teamLogos/seattle-seahawks-logo.png";
import TampaBayBuccaneers from "../../teamLogos/tampa-bay-buccaneers-logo.png";
import TennesseeTitans from "../../teamLogos/tennessee-titans-logo.png";
import WashingtonCommanders from "../../teamLogos/washington-commanders-logo.png";



const teamLogos = {
  'Arizona Cardinals': ArizonaCardinals,
  'Atlanta Falcons': AtlantaFalcons,
  'Baltimore Ravens': BaltimoreRavens,
  'Buffalo Bills': BuffaloBills,
  'Carolina Panthers': CarolinaPanthers,
  'Chicago Bears': ChicagoBears,
  'Cincinnati Bengals': CincinnatiBengals,
  'Cleveland Browns': ClevelandBrowns,
  'Dallas Cowboys': DallasCowboys,
  'Denver Broncos': DenverBroncos,
  'Detroit Lions': DetroitLions,
  'Green Bay Packers': GreenBayPackers,
  'Houston Texans': HoustonTexans,
  'Indianapolis Colts': IndianapolisColts,
  'Jacksonville Jaguars': JacksonvilleJaguars,
  'Kansas City Chiefs': KansasCityChiefs,
  'Las Vegas Raiders': LasVegasRaiders,
  'Los Angeles Chargers': LosAngelesChargers,
  'Los Angeles Rams': LosAngelesRams,
  'Miami Dolphins': MiamiDolphins,
  'Minnesota Vikings': MinnesotaVikings,
  'New England Patriots': NewEnglandPatriots,
  'New Orleans Saints': NewOrleansSaints,
  'New York Giants': NewYorkGiants,
  'New York Jets': NewYorkJets,
  'Philadelphia Eagles': PhiladelphiaEagles,
  'Pittsburgh Steelers': PittsburghSteelers,
  'San Francisco 49ers': SanFrancisco49ers,
  'Seattle Seahawks': SeattleSeahawks,
  'Tampa Bay Buccaneers': TampaBayBuccaneers,
  'Tennessee Titans': TennesseeTitans,
  'Washington Commanders': WashingtonCommanders
};


  const predictionContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px', 
    margin: '0 auto',
    fontWeight: 'bold' 
  };
  
  const teamInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    width: '100%',
    marginBottom: '20px',
    fontWeight: 'bold' 
  };

  const errorMessageStyle = {
    width: '100%', 
    textAlign: 'center', 
    color: 'red', 
    margin: '20px 0' 
  };

  const teamLogoStyle = {
    height: '150px', 
    width: '150px',
    justifyContent: 'space-around', 
  };

  const teamLogoAndLabelStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: '0px 40px',
  };
  
  const progressBarContainerStyle = {
    display: 'flex',
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
    fontWeight: 'bold' 
  };
  
  const progressBarStyle = (percentage, baseColor) => ({
    width: `${percentage}%`,
    backgroundColor: baseColor,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0',
    transition: 'width 0.3s ease-in-out',
  });
  

const MatchPredictions = () => {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8080/teams');
        setTeams(response.data.map(team => ({ label: team.team_name, code: team.team})));
    } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };
    fetchTeams();
  }, []);

  const fetchPrediction = async () => {    
    if (!team1 || !team2 || team1.label === team2.label) {
    setError('Please enter two different teams to get the prediction.');
    return}
  setLoading(true);
  setError('');
  try {
    const response = await axios.get(`http://localhost:8080/match_predictions/${team1.code}/${team2.code}`);
    setPrediction(response.data[0]);
  } catch (err) {
    setError(err.response?.data || 'Error fetching data.');
  }
  setLoading(false);
};

return (
    <Box style={{ padding: '20px' }}>
       <Box style={teamInfoStyle}>
        <Autocomplete
          options={teams}
          getOptionLabel={(option) => option.label}
          style={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Enter Team 1" variant="outlined" />}
          onChange={(_, newValue) => setTeam1(newValue)}
          disableClearable
        />
        <div style={{ margin: '0 10px' }}></div> 
        <Autocomplete
          options={teams}
          getOptionLabel={(option) => option.label}
          style={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Enter Team 2" variant="outlined" />}
          onChange={(_, newValue) => setTeam2(newValue)}
          disableClearable
        />
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#0C49BE'}}>
      <Button
        variant="contained"
        onClick={fetchPrediction}
        disabled={loading || !team1 || !team2}
      >
        {loading ? <CircularProgress size={24} /> : 'Make Prediction!'}
      </Button>
      </Box>
      {error && <div  style={errorMessageStyle}>{error}</div>}
      {prediction && (
        <Box style={predictionContainerStyle}>
          <Box style={teamInfoStyle}>
          <Box style={teamLogoAndLabelStyle}>
              <img src={teamLogos[team1.label]} 
                alt={team1.label}
                style={teamLogoStyle}
              />
              <p>{team1.label}</p>
            </Box>
            <Box style={teamLogoAndLabelStyle}>
              <img src={teamLogos[team2.label]} 
                alt={team2.label}
                style={teamLogoStyle}
              />
               <p>{team2.label}</p>
            </Box>
          </Box>
          <Box style={progressBarContainerStyle}>
            <Box style={progressBarStyle(prediction.team_win_probability * 100, '#4caf50')}>
              {`${(prediction.team_win_probability * 100).toFixed(2)}%`}
            </Box>
            <Box style={progressBarStyle((1 - prediction.team_win_probability) * 100, '#f44336')}>
              {`${((1 - prediction.team_win_probability) * 100).toFixed(2)}%`}
            </Box>
          </Box>
          <Box style={{ width: '100%', textAlign: 'center', marginBottom: '0px', padding: '20px' }}>
            <p>{`Team ${team1.label} has a ${(prediction.team_win_probability * 100).toFixed(2)}% chance of winning`}</p>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default MatchPredictions;