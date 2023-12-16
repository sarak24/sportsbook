import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { DatePicker, Select } from "antd";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';


const WeatherComponent = () => {
  const [teamNameData, setTeamNameData] = useState(null);
  const [teamDate, setTeamDate] = useState(null);
  const [weatherData, setWeatherData] = useState({}) 

  const getData = async () => {
    // console.log({ teamDate: teamDate, teamNameData: teamNameData });
    const res = await axios.get(
      `http://localhost:8080/weather_insights/${teamDate}/${teamNameData}`
    );
    res?.status === 200 && setWeatherData(res?.data[0]);
    console.log(res.data);
  };

  
  const onChange = (date, dateString) => {
    setTeamDate(dateString);
  };

  const nflTeams = [
    { label: 'ARI'},
    { label: 'ATL'},
    { label: 'BAL'},
    { label: 'BOS'},
    { label: 'BUF'},
    { label: 'CAR'},
    { label: 'CHI'},
    { label: 'CIN'},
    { label: 'CLE'},
    { label: 'DAL'},
    { label: 'DEN'},
    { label: 'DET'},
    { label: 'GB'},
    { label: 'HOU'},
    { label: 'IND'},
    { label: 'JAX'},
    { label: 'KC'},
    { label: 'LA'},
    { label: 'LAC'},
    { label: 'LAR'},
    { label: 'LV'},
    { label: 'MIA'},
    { label: 'MIN'},
    { label: 'NE'},
    { label: 'NO'},
    { label: 'NYG'},
    { label: 'NYJ'},
    { label: 'OAK'},
    { label: 'PHI'},
    { label: 'PIT'},
    { label: 'SD'},
    { label: 'SEA'},
    { label: 'SF'},
    { label: 'TB'},
    { label: 'TEN'},
    { label: 'WAS'},
    ];

  return (
    <div className="flex flex-col px-32">
      <div className="flex  bg-header_color p-4 rounded-t-md"></div>
      <div className="flex my-20 ">
        <div style={{ display: "flex", flexDirection: "column", flex: "2" }}>
          <div>
            <Autocomplete
              autoComplete
              includeInputInList
              id="nfl-teams"
              options={nflTeams}
              sx={{ width: 300 }}
              variant="outlined"
              getOptionLabel={(option) => option.label} // Add this line to specify the label
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Team"
                  onChange={(e) => setTeamNameData(e?.target?.value)}
                />
              )}
              onChange={(event, value) => setTeamNameData(value?.label || null)} // Updated this line
            />
            {/* <span className="text-lg font-bold">Select Team</span>
            <Select
              showSearch
              style={{
                marginTop: "5px",
                width: "100%",
                background: "#fafafa",
                borderRadius: "8px",
                outline: "none !important",
              }}
              optionFilterProp="children"
              // onChange={onChange}
              // onSearch={onSearch}
              // filterOption={filterOption}
              placeholder={
                <span>
                  <SearchOutlined /> Select a team
                </span>
              }
              options={teamsName}
              allowClear
              className="ant-select-selection"
            /> */}
          </div>
          <div className="flex flex-col mt-5">
            <TextField
              id="date"
              label="Select Date"
              type="date"
              onChange={(e) => setTeamDate(e?.target?.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div class="mt-4">
            <Button
              variant="contained"
              onClick={() => {
                teamNameData && teamDate && getData();

              }}
              className={`${teamNameData && teamDate ? "cursor-pointer" : "cursor-not-allowed"
                } ${teamNameData && teamDate ? "bg-blue-600" : "bg-gray-400"
                }  mt-6 px-7 py-2  flex justify-center text-white text-lg font-bold`}
            >
              Compare
            </Button>
          </div>
        </div>
        { }
        {!weatherData ? <div
          style={{ width: "100%", border: "1px solid blue", flex: "2" }}
          className="rounded-md h-fit ml-10 "
        >
          <div className="flex  bg-header_color p-4 rounded-t-md"></div>
          <div className="flex flex-col py-5">
            <h1 className="flex justify-center text-lg py-5 font-bold mb-2">
              No match found.
            </h1>
          </div>
          <div className="flex  bg-header_color p-4 rounded-b-md"></div>
        </div> 
        :<div
          style={{ width: "100%", border: "1px solid blue", flex: "2" }}
          className="rounded-md h-fit ml-10 "
        >
          <div className="flex  bg-header_color p-4 rounded-t-md"></div>
          <div className="flex flex-col ">
            <h1 className="flex justify-center text-lg font-bold mb-2">
              {weatherData?.game_date
                ? moment(weatherData?.game_date).format("YYYY-MM-DD")
                : "Game Date"}
              , {weatherData?.season ? weatherData?.season : "Season"}
            </h1>
            <div className="flex flex-col px-8">
              <span>
                Temprature (in degrees):{" "}
                {weatherData?.temperature && weatherData?.temperature}
              </span>
              <span>Wind Speed: {weatherData?.wind && weatherData?.wind}</span>
              <span>
                Humidity Level: {weatherData?.humidity && weatherData?.humidity}
              </span>
              <span className="mb-5">Weather Details, if any: {weatherData?.details}</span>
            </div>
            <div
              style={{ borderBottom: "2px solid blue" }}
              className="flex justify-around font-bold text-lg"
            >
              <span>{weatherData?.team ? weatherData?.team : "Team"}</span>
              <span>
                {weatherData?.opponent ? weatherData?.opponent : "Opponent"}
              </span>
            </div>
            <div className="flex justify-around mb-7">
              <span>
                {weatherData?.team_score
                  ? weatherData?.team_score
                  : "Team Score"}
              </span>
              <span>
                {weatherData?.opp_score
                  ? weatherData?.opp_score
                  : "Opponent Score"}
              </span>
            </div>
          </div>
          <div className="flex  bg-header_color p-4 rounded-b-md"></div>
        </div>}
      </div>
      <div className="flex  bg-header_color p-4 rounded-b-md"></div>
    </div>
  );
};

export default WeatherComponent;

const teamsName = [
  { label: "team a", value: "1" },
  { label: "team b", value: "2" },
  { label: "team c", value: "3" },
];
