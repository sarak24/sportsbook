const mysql = require('mysql2')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.database
  });
  connection.connect((err) => err && console.log(err));

  /**************
   HELPERS
  **************/

 async function get_playerID(first_name, last_name, callback) {
  connection.query(`
    SELECT player_id
    FROM Player
    WHERE first_name = '${first_name}' AND last_name = '${last_name}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      callback(err, null);
      return null;
    } else {
      console.log(`Found ${data.length} matches.`)
      callback(null, data);
      return data;
    }
  });
}
const get__playerID = async (first_name, last_name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT player_id
      FROM Player
      WHERE first_name = '${first_name}' AND last_name = '${last_name}';
    `,
      (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(`Found ${data.length} matches.`);
          resolve(data || null);
        }
      }
    );
  });
}
  /******************
 * ROUTES *
 ******************/
// Route 1: GET /fantasy_insights
/* Calculates information about football players, their careers, and teams, 
creating a summary that includes a unified player profile and aggregates 
career statistics for players who have been on the same team in different years.
*/
const fantasy_insights = async function(req, res) { 
  console.log("fantasy insights")
  const sql = 
  `SELECT
  COALESCE(p1.player_id, p2.player_id) AS combined_player_id,
  COALESCE(p1.first_name, p2.first_name) AS combined_first_name,
  COALESCE(p1.last_name, p2.last_name) AS combined_last_name,
  COALESCE(p1.position, p2.position) AS combined_position,
  COALESCE(p1.current_team, p2.current_team) AS combined_current_team,
  COALESCE(c1.year, c2.year) AS combined_year,
  SUM(COALESCE(c1.games_played, 0)) + SUM(COALESCE(c2.games_played, 0)) AS combined_games_played
FROM
  Player p1
LEFT JOIN
  Career c1 ON p1.player_id = c1.player_id
LEFT JOIN
  Player p2 ON p1.current_team = p2.current_team AND p1.player_id <> p2.player_id
LEFT JOIN
  Career c2 ON p2.player_id = c2.player_id AND c1.year = c2.year AND c1.team = c2.team
GROUP BY
  combined_player_id, combined_first_name, combined_last_name, combined_position, combined_current_team, combined_year
  LIMIT 50;`
  // `SELECT * FROM Game 
  // LIMIT 50;`
  const params = "";
  connection.query(sql, params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ err });
    } else {
      console.log(data)
      res.json(data);
    }
  });
}
// Route 2: GET /player_info
// Selects all attributes 
// of a player given first and last name
// http://localhost:8080/player_info/fred/evans
const player_info = async function (req, res) {
  const firstName = req.params.first_name;
  const lastName = req.params.last_name;
  if (!firstName || !lastName) {
    res.status(400).send('Must give both a first and last name');
    return;
  }
  try {
    let callback = function (error, data) {
      if (error) {
        // Handle the error
      } else {
        // Use the results
        if (!data) {
          res.status(400).send('No player matching the name you entered.');
          return;
        }
        var playerID = data[0].player_id;
        console.log(`setting playerID to ${data[0].player_id}`);
        connection.query(`
        SELECT
            P.*
          FROM
            Player P
          JOIN
            Game G ON P.player_id = G.player_id
          JOIN
            Career C ON P.player_id = C.player_id
          WHERE
            P.player_id = '${playerID}'
          LIMIT 1
  `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data)
          }
        })
      }
    }
    // get player id
    await get_playerID(firstName, lastName, callback);
  } catch (error) {
    // If an error is caught, send an error response
    console.error('Error during query:', error);
    res.status(500).send(error.message || 'An error occurred during upload');
  }
}

/// Route 3: GET /weather_insights
/* Retrieves information about a game and weather
given the two, includes details about the 
game (season, opponent, scores) and weather information for the corresponding game date. */
// http://localhost:8080/weather_insights/1970-09-20/BOS
const weather_insights = async function(req, res) {
  console.log("weather_insights 2 ",req.params)
  const game_date = req.params.game_date; //'1970-09-20'
  const team = req.params.team; //'BOS'
    const sql = 
    `SELECT
    g.player_id,
    g.team,
    g.season,
    g.home_away,
    g.opponent,
    g.team_score,
    g.opp_score,
    w.game_date,
    w.host,
    w.temperature,
    w.wind,
    w.humidity,
    w.details
    FROM
    Game g
    INNER JOIN Weather w
    ON w.game_date = g.game_date AND (w.host = g.team OR w.host = g.opponent)
    WHERE g.team = '${team}' AND g.game_date = '${game_date}'
    LIMIT 1;`
  const params = "";
  connection.query(sql, params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ err });
    } else {
      console.log(data)
      res.json(data);
    }
  });
}

// Route 4: GET /match_predictions/OAK/PHI
// Returns prediction of the match given team1 and team2 required parameters
// http://localhost:8080/match_predictions/OAK/PHI
const match_predictions = async function (req, res) {
  console.log("match_predictions",req.params)
  const team1 = req.params.team1;
  const team2 = req.params.team2;
  if (!team1 || !team2) {
    res.status(400).send('Must enter two teams to get the prediction.');
    return;
  }
  if (team1 == team2) {
    res.status(400).send('Must enter two different teams to get the prediction.');
    return;
  }
  const sql = 
  `SELECT  
  (COUNT(CASE WHEN team_score > opp_score THEN 1 END) * 1.0) / COUNT(*) AS team_win_probability
  FROM Game
  WHERE (team = '${team1}' AND opponent = '${team2}')`
  const params = "";
  connection.query(sql, params, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    if(err){
    res.status(500).send('Error fetching data.');}
    if(data.length === 0) {
    res.status(404).send('No matching results.');
    }
    res.json({ err });
  } else {
    console.log(data)
    res.json(data);
  }
  });
  }

// Route 5: GET /player_comparison/Aaron/Wallace/Travis/Kelce
// Returns number of win/loss games
// http://localhost:8080/player_comparison/Travis/Kelce/Tom/Brady
const player_comparison = async function(req, res) {
  const firstName1 = req.params.firstName1;
  const lastName1 = req.params.lastName1;
  const firstName2 = req.params.firstName2;
  const lastName2 = req.params.lastName2;
  console.log(firstName1 + " " + lastName1 + " " + firstName2 + " " + lastName2);
  if (!firstName1 || !lastName1 || !firstName2 || !lastName2) {
    res.status(400).send('Must give both a first and last name of both players.');
    return;
  }
  if ((firstName1 == firstName2) && (lastName1 == lastName2)) {
    res.status(400).send('Must enter two different players to get the prediction.');
    return;
  }
  try {
    const playerData1 = await get__playerID(firstName1, lastName1);
    const playerData2 = await get__playerID(firstName2, lastName2);
    if (!playerData1 || playerData1.length === 0 || !playerData2 || playerData2.length === 0) {
      res.status(404).send('No players matching the names you entered.');
      return;
    }
    var playerID1 = playerData1[0].player_id;
    var playerID2 = playerData2[0].player_id;
    connection.query(`
    WITH gc_win_loss_onehotcode AS
    (SELECT
        *,
        CASE gc.outcome
            WHEN 'W' THEN 1
            WHEN 'L' THEN 0
        END AS win_outcome_as_one
    FROM Game_combined gc
    )
    SELECT DISTINCT
        SUM(gc1.win_outcome_as_one) AS win_count,
        COUNT(*)-SUM(gc1.win_outcome_as_one) AS loss_count
    FROM gc_win_loss_onehotcode gc1
    JOIN gc_win_loss_onehotcode gc2 ON gc1.game_date = gc2.game_date AND gc1.opponent = gc2.team
    JOIN Player p1 ON gc1.player_id = p1.player_id
    JOIN Player p2 ON gc2.player_id = p2.player_id
    WHERE gc1.player_id = '${playerID1}' AND gc2.player_id = '${playerID2}'
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.status(500).send('Error fetching data');
      } else {
        res.json(data);
      }
    });
  } catch (error) {
    console.error('Error during query:', error);
    res.status(500).send(error.message || 'An error occurred during upload');
  }
};
  
// Route 6: GET /player_comparison_games/Travis/Kelce/Tom/Brady
// Returns count of win, losses between two players
// http://localhost:8080/player_comparison_games/Travis/Kelce/Tom/Brady
const player_comparison_games = async function(req, res) {
  const firstName1 = req.params.firstName1;
  const lastName1 = req.params.lastName1;
  const firstName2 = req.params.firstName2;
  const lastName2 = req.params.lastName2;
  console.log(firstName1 + " " + lastName1 + " " + firstName2 + " " + lastName2);
  if (!firstName1 || !lastName1 || !firstName2 || !lastName2) {
    res.status(400).send('Must give both a first and last name of both players.');
    return;
  }
  if ((firstName1 == firstName2) && (lastName1 == lastName2)) {
    res.status(400).send('Must enter two different players to get the prediction.');
    return;
  }
  try {
    const playerData1 = await get__playerID(firstName1, lastName1);
    const playerData2 = await get__playerID(firstName2, lastName2);
    if (!playerData1 || playerData1.length === 0 || !playerData2 || playerData2.length === 0) {
      res.status(404).send('No players matching the names you entered.');
      return;
    }
    var playerID1 = playerData1[0].player_id;
    var playerID2 = playerData2[0].player_id;
    console.log(playerID1)
    console.log(playerID2)
    connection.query(`
    (WITH first_player AS (
      SELECT team, opponent, season, game_date, team_score, opp_score
      FROM Game
      WHERE player_id = '${playerID1}'
    )
    SELECT Game.team AS team, Game.opponent AS opponent, Game.season AS season, Game.game_date AS date, Game.team_score AS team_score, Game.opp_score AS opp_score
    FROM Game
    JOIN first_player ON (first_player.team = Game.opponent AND
                          first_player.season = Game.season AND
                          first_player.game_date = Game.game_date)
    WHERE Game.player_id = '${playerID2}'
    ORDER BY Game.game_date DESC
    LIMIT 1
    )
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error occured');
      } else {
        if (!data || data.length === 0) {
          res.status(200).send('No games found between the specified players.');}
        else{res.json(data);}
      }
    });
  } catch (error) {
    console.error('Error during query:', error);
    res.status(500).send(error.message || 'An error occurred during upload');
  }
};

// Route 7A: GET /game_table with pagination
// Fetching unique games from Game (Game History page #1) with pagination
// http://localhost:8080/game_table?page=1&limit=10
const game_table = async function(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1; 
    const limit = parseInt(req.query.limit, 10) || 10; 
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT team1, team2, game_date, CONCAT(team1_score,' to ', team2_score) as final_score,
        IF (team1_score > team2_score, team1, team2) as winner
        FROM unique_games
        WHERE team1 > team2
        ORDER BY game_date DESC
        LIMIT ?, ?
      `, [offset, limit],
        (err, games) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            connection.query(`
              SELECT COUNT(*) AS total FROM unique_games WHERE team1 > team2
            `, (err, total) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                const totalPages = Math.ceil(total[0].total / limit);
                res.json({ games, totalPages });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    console.error('Error during query:', error);
    res.status(500).send(error.message);
  }
};


// Route 7B: GET /game_history/SD/OAK/1995-09-03
// Fetching game history, as well as players who had significant impact on the game for both teams
// http://localhost:8080/game_history/SD/OAK/1995-09-03
const game_history = async function(req, res) {
  const team1 = req.params.team1;
  const team2 = req.params.team2;
  const game_date = req.params.game_date;
  const sql = 
    `
    WITH players_in_game(player_id, game_date) AS
         (SELECT G.player_id, game_date
          FROM Game G
          WHERE ((team = '${team2}' AND opponent = '${team1}') OR (team = '${team1}' AND opponent = '${team2}'))
            AND game_date = '${game_date}'),
     player_stats(player_id, team, position, passing_receiving_yards, rushing_yards, touchdowns) AS
         (
         SELECT QB.player_id, QB.team, 'QB' as position,
                  COALESCE(Passing_Yards,0)       AS stat1,
                  COALESCE(Rushing_Yards,0)        AS stat2,
                  COALESCE(Rushing_TDs,0) + COALESCE(TD_Passes,0) AS stat3
           FROM (SELECT GQB.*
                 FROM players_in_game PIG
                     JOIN Game_Quarterback GQB
                ON PIG.player_id = GQB.player_id AND PIG.game_date = GQB.game_date) QB
          UNION
          SELECT WRTE.player_id, WRTE.team, 'WR/TE' as position,
                  COALESCE(Receiving_Yards,0)      AS stat1,
                  COALESCE(Rushing_Yards,0)        AS stat2,
                  COALESCE(Rushing_TDs,0) + COALESCE(Receiving_TDs, 0) AS stat3
           FROM (SELECT GWRTE.*
                 FROM players_in_game PIG
                     JOIN Game_Wide_Receiver_and_Tight_End GWRTE
                ON PIG.player_id = GWRTE.player_id AND PIG.game_date = GWRTE.game_date) WRTE
          UNION
          SELECT RB.player_id, RB.team, 'RB' as position,
                  COALESCE(Receiving_Yards, 0)      AS stat1,
                  COALESCE(Rushing_Yards,0)        AS stat2,
                  COALESCE(Rushing_TDs,0) + COALESCE(Receiving_TDs,0) AS stat3
           FROM (SELECT GRB.*
                 FROM players_in_game PIG
                     JOIN Game_Runningback GRB
                ON PIG.player_id = GRB.player_id AND PIG.game_date = GRB.game_date) RB
           )
SELECT CONCAT(p.first_name, ' ', p.last_name) AS Player_Name, player_stats.*
FROM player_stats
JOIN Player p ON player_stats.player_id = p.player_id
ORDER BY (passing_receiving_yards + rushing_yards + 100*touchdowns) DESC
LIMIT 8;
    `
    const params = "";
    connection.query(sql, params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ err });
    } else {
      // console.log(data)
      res.json(data);
    }
  });
  }


// Route 8: GET /player_database/
// http://localhost:8080/player_database/?page=1&limit=10
  const player_database = async function(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1; 
      const limit = parseInt(req.query.limit, 10) || 10; 
      const offset = (page - 1) * limit;

      connection.query(`
        SELECT COUNT(*) AS total FROM Player
      `, (err, totalResult) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error occurred while fetching player count');
        } else {
          const totalPlayers = totalResult[0].total;
          const totalPages = Math.ceil(totalPlayers / limit);

          connection.query(`
            SELECT first_name, last_name, current_team, high_school
            FROM Player
            WHERE current_team IS NOT NULL AND current_team != ''
                  AND high_school IS NOT NULL AND high_school != ''
            ORDER BY last_name, first_name
            LIMIT ?, ?
          `, [offset, limit], (err, players) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error occurred while fetching players');
            } else {
              res.json({ players, totalPages });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error during query:', error);
      res.status(500).send(error.message || 'An error occurred during upload');
    }
}


// Route 9: GET /teammates
// http://localhost:8080/teammates/Travis/Kelce
const teammates = async function (req, res) {
  const firstName = req.params.first_name;
  const lastName = req.params.last_name;
    
    if (!firstName || !lastName) {
      res.status(400).send('Must give both a first and last name');
      return;
    }
  
    try {
    let callback = function (error, data) {
      if (error) {
      } else {
        if (!data) {
          res.status(400).send('No players matching the name you entered.');
          return;
        }
        var playerID = data[0].player_id;
        console.log(`setting playerID to ${data[0].player_id}`);
        connection.query(`
        WITH connections(player_id, years, teams, degree)
        AS (SELECT comb.player_id, years, teams, 1 as degree
              FROM (SELECT player_id,
                           GROUP_CONCAT(T.year) as years,
                           GROUP_CONCAT(T.team) as teams
                    FROM (SELECT C2.player_id,
                                 C2.year,
                                 C2.team
                          FROM (SELECT * FROM Player WHERE player_id = '${playerID}') P
                                   JOIN Career C1 ON P.player_id = C1.player_id
                                   JOIN Career C2 ON C1.year = C2.year AND C1.team = C2.team
                          WHERE C1.player_id != C2.player_id
                          ORDER BY player_id, year) T
                GROUP BY T.player_id) comb
              UNION ALL
              SELECT connector.player_id,
                     GROUP_CONCAT(connector.year) as years,
                     GROUP_CONCAT(connector.team) as teams,
                     2                            as degree
              FROM (SELECT C4.player_id, C4.year, C4.team
                    FROM (SELECT C3.year, C3.team
                          FROM (SELECT C2.player_id, C2.year, C2.team
                                FROM (SELECT * FROM Player WHERE player_id = '${playerID}') P
                                         JOIN Career C1 ON P.player_id = C1.player_id
                                         JOIN Career C2 ON C1.year = C2.year AND C1.team = C2.team
                                WHERE C1.player_id != C2.player_id) first
                        JOIN Career C3 ON first.player_id = C3.player_id AND first.team = C3.team
                        GROUP BY C3.year, C3.team) connector
                    JOIN Career C4 ON connector.year = C4.year AND connector.team = C4.team
                    GROUP BY C4.player_id, C4.team, C4.year) connector
              WHERE connector.player_id != '${playerID}'
              GROUP BY connector.player_id)
        SELECT P2.first_name, P2.last_name, connections.years, connections.teams, connections.degree
        FROM connections
        JOIN (SELECT player_id, MIN(degree) as degree
              FROM connections
              GROUP BY player_id) max
        ON connections.player_id = max.player_id AND connections.degree = max.degree
        JOIN Player P2 ON P2.player_id = connections.player_id
        ORDER BY degree, first_name, last_name
        LIMIT 16;
  `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data)
          }
        })
      }
    }
    // get player id
    await get_playerID(firstName, lastName, callback);
  } catch (error) {
    // If an error is caught, send an error response
    console.error('Error during query:', error);
    res.status(500).send(error.message || 'An error occurred during upload');
  }
}

// Route 10: GET //player_historical_opponents
// Lists all historical player opponents for a given player if they played head-to-head in one game
// http://localhost:8080/player_historical_opponents?first_name1=Aaron&last_name1=Bailey
/*
Optimizations 
Player’s Historical Opponent
9.341
1.176
87.4%
Creating index on game_date for Game_combined tables: 4.840 sec.
*/
const player_historical_opponents = async function(req, res) {
  const { first_name, last_name } = req.query; // Updated parameter names
  try {
    if (!first_name || !last_name) {
      res.status(400).send('Must give both a first and last name');
      return;
    }
    // Helper function to get player ID
    function getPlayerID(firstName, lastName) {
      return new Promise((resolve, reject) => {
        get_playerID(firstName, lastName, (err, data) => {
          if (err || !data || data.length === 0) {
            res.status(500).send('Player not found');
            reject(err || "Player not found");
          } else {
            resolve(data[0].player_id);
          }
        });
      });
    }
    // Get player ID for the given player's first and last name
    const playerID = await getPlayerID(first_name, last_name); // Updated parameters
    // SQL query with player ID
    const sql = `
      SELECT DISTINCT
        CONCAT(p2.first_name, ' ', p2.last_name) AS Historical_Opponent
      FROM
        Game_combined gc1
      JOIN
        Game_combined gc2 ON gc1.game_date = gc2.game_date AND gc1.opponent = gc2.team
      JOIN
        Player p1 ON gc1.player_id = p1.player_id
      JOIN
        Player p2 ON gc2.player_id = p2.player_id
      WHERE
        gc1.player_id = ?`; // Player ID placeholder
    const params = [playerID]; // Value to replace the placeholder
    // Execute the SQL query with player ID as a parameter
    connection.query(sql, params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err });
      } else {
        console.log(data);
        res.json(data);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
/// Route 11: GET /weather_insights_teams_head_to_head -- can be dropped, given existing Route 5: /match_predicitons
/* Retrieves information about pairs of teams which played head-to-head in the same game, 
including scores and weather information for the corresponding game date. */
// http://localhost:8080/weather_insights_teams_head_to_head?team1=OAK&team2=PHI
const weather_insights_teams_head_to_head = async function(req, res) {
  const { team1, team2 } = req.query; // Values received from the frontend
  try {
    // SQL query using team names directly
    const sql = `
      SELECT DISTINCT
        gc1.game_date,
        gc1.team AS team1,
        gc1.team_score AS teamScore,
        gc2.team AS team2,
        gc1.opp_score AS opponentScore,
        w.temperature,
        w.wind,
        w.humidity,
        w.details
      FROM
        Game_combined gc1
      JOIN
        Game_combined gc2 ON gc1.game_date = gc2.game_date AND gc1.opponent = gc2.team
      JOIN
        Weather w ON gc1.game_date = w.game_date
      WHERE
        gc1.team = '${team1}' AND gc2.team = '${team2}'`; // Directly using team names as strings
    // Execute the SQL query with team names as strings in the query
    connection.query(sql, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ err });
      } else {
        console.log(data);
        res.json(data);
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

// Route 12: GET /player_comparison_with_weather_log -- dropped, same as Route 6: /player_comparison
// Lists all game dates with weather stats when two players played head-to-head
// http://localhost:8080/player_comparison_with_weather_log?first_name1='Omar&last_name1=Ellison&first_name2=Aaron&last_name2=Bailey
// problem unsolved -- if single quote exist in player's name, then cause error when passing to SQL query
// http://localhost:8080/player_comparison_with_weather_log?first_name1=Aaron&last_name1=Bailey&first_name2=Ben&last_name2=Cavil
const player_comparison_with_weather_log = async function(req, res) {
  const { first_name1, last_name1, first_name2, last_name2 } = req.query; // Values received from the frontend
  // Helper function to get player ID
  async function getPlayerID(firstName, lastName) {
    return new Promise((resolve, reject) => {
      get_playerID(firstName, lastName, (err, data) => {
        if (err || !data || data.length === 0) {
          reject(err || "Player not found");
        } else {
          resolve(data[0].player_id);
        }
      });
    });
  }
  try {
    // Get player IDs for both players
    const playerID1 = await getPlayerID(first_name1, last_name1);
    const playerID2 = await getPlayerID(first_name2, last_name2);
    // SQL query with player IDs
    const sql = `
      SELECT DISTINCT
        gc1.game_date,
        CONCAT(p1.first_name, ' ', p1.last_name) AS Player_1_Name,
        CONCAT(p2.first_name, ' ', p2.last_name) AS Player_2_Name,
        gc1.team AS Team_1,
        gc1.team_score AS Player_1_Team_Score,
        gc2.team AS Team_2,
        gc1.opp_score AS Player_2_Team_Score,
        w.temperature,
        w.wind,
        w.humidity,
        w.details
      FROM
        Game_combined gc1
      JOIN
        Game_combined gc2 ON gc1.game_date = gc2.game_date AND gc1.opponent = gc2.team
      JOIN
        Weather w ON gc1.game_date = w.game_date
      JOIN
        Player p1 ON gc1.player_id = p1.player_id
      JOIN
        Player p2 ON gc2.player_id = p2.player_id
      WHERE
        gc1.player_id = ?
        AND gc2.player_id = ?`; // Player 2 ID
    const params = [playerID1, playerID2]; // Values to replace the placeholders
    // Execute the SQL query with player IDs as parameters
    connection.query(sql, params, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ err });
      } else {
        console.log(data);
        res.json(data);
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

// Route 13: GET /connections
// http://localhost:8080/connections/Travis/Kelce/Tom/Brady
// returns first_name, last_name, team, overlap_years, same_position
const connections = async function (req, res) {
  const connector_firstname = req.params.firstName1;
  const connector_lastname = req.params.lastName1;
  const my_firstname = req.params.firstName2;
  const my_lastname = req.params.lastName2;
  console.log("Connectors's name: " + connector_firstname+" "+connector_lastname)
  console.log("My name: " + my_firstname+" "+my_lastname)
  if (!connector_firstname || !connector_lastname || !my_firstname || !my_lastname) {
    res.status(400).send('Missing one/both names.');
    return;
  }
  if ((connector_firstname == my_firstname) && (connector_lastname == my_lastname)) {
    res.status(400).send('Your name cannot be the same as the connector\'s name.');
    return;
  }
  try {
    const connector = await get__playerID(connector_firstname, connector_lastname);
    const me = await get__playerID(my_firstname, my_lastname);
    var connector_id = connector[0].player_id;
    var my_id = me[0].player_id;
    return new Promise((resolve, reject) => {
      connection.query(`
      WITH teammates(tgt, teammate, team, overlap_years) AS
         (SELECT C1.player_id          as tgt,
                 C2.player_id,
                 C2.team,
                 GROUP_CONCAT(C2.year) as overlap_years
          FROM Career C1
                   JOIN Career C2 ON C1.year = C2.year AND C1.team = C2.team
          WHERE C1.player_id != C2.player_id AND
                C1.player_id = '${connector_id}' AND
                C2.player_id = '${my_id}'
          GROUP BY C1.team),
     teammates_position(tgt, teammate, team, year, same_pos) AS
         (SELECT C1.player_id as tgt,
                 C2.player_id,
                 C2.team,
                 C2.year,
                 IF (C1.position = C2.position,  'True', 'False')
          FROM Career C1
                   JOIN Career C2 ON C1.year = C2.year AND C1.team = C2.team
          WHERE C1.player_id != C2.player_id AND
                C2.player_id = '${connector_id}'
          GROUP BY C1.player_id, C2.team, C2.year, C1.position, C2.position)
SELECT P.first_name, P.last_name, T2.team,
       GROUP_CONCAT(T2.year) as years_overlap,
       IF(FIND_IN_SET('true', GROUP_CONCAT(T2.same_pos)) <> 0, 'true', 'false') as same_position
FROM teammates T1,
     teammates_position T2,
     Player P
WHERE T1.tgt = T2.teammate
  AND T1.team = T2.team
  AND T1.overlap_years LIKE CONCAT('%', T2.year, '%')
  AND T1.teammate != T2.tgt
  AND T2.tgt = P.player_id
GROUP BY T2.tgt, T2.team
LIMIT 3;
      `,
       (err, data) => {
          if (err) {
            console.error(err);
            res.json(err);
          } else {
            // console.log(data);
            res.json(data || null);
          }
        }
      );
    });
} catch (error) {
  console.error('Error during query:', error);
  res.status(500).send(error.message);
}
}

// Route 14: GET /contributors with pagination
// Example: http://localhost:8080/contributors/team?page=1&limit=10
const contributors = async function (req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1; 
    const limit = parseInt(req.query.limit, 10) || 10; 
    const offset = (page - 1) * limit;

    //const team = req.params.team;
    const team = req.query.team;

    if (team == null) {
      // General results for all players/teams sorted by percentage
      console.log("Showing players who contributed at least 5% to their team's total points");
      return new Promise((resolve, reject) => {
        connection.query(`
          SELECT P.first_name, P.last_name, SP.team, SP.season_years, SP.player_points, TS.team_total, 
          SP.player_points/TS.team_total as percentage
          FROM scoring_players SP
          JOIN (SELECT team, season_years, SUM(team_score) AS team_total
                FROM team_season_score
                GROUP BY team, season_years) TS
          ON SP.team = TS.team AND SP.season_years = TS.season_years
          JOIN Player P ON SP.player_id = P.player_id
          WHERE SP.player_points >= 0.15 * TS.team_total
          ORDER BY percentage DESC
          LIMIT ?, ?
        `, [offset, limit], (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            connection.query(`
              SELECT COUNT(*) AS total 
              FROM scoring_players SP
              JOIN (SELECT team, season_years, SUM(team_score) AS team_total
                    FROM team_season_score
                    GROUP BY team, season_years) TS
              ON SP.team = TS.team AND SP.season_years = TS.season_years
              JOIN Player P ON SP.player_id = P.player_id
              WHERE SP.player_points >= 0.15 * TS.team_total
            `, (err, total) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                const totalPages = Math.ceil(total[0].total / limit);
                res.json({ data, totalPages });
              }
            });
          }
        });
      });
    } else {
      // Filter top contributors for a specific team
      console.log("Team's name: " + team);
      return new Promise((resolve, reject) => {
        connection.query(`
          SELECT P.first_name, P.last_name, scoring_players.season_years, scoring_players.player_points, TS.team_total,
          scoring_players.player_points/TS.team_total as percentage
          FROM scoring_players
          JOIN (SELECT team, season_years, SUM(team_score) AS team_total
                       FROM team_season_score
                       GROUP BY team, season_years) TS
          ON scoring_players.team = TS.team AND scoring_players.season_years = TS.season_years
          JOIN Player P ON scoring_players.player_id = P.player_id
          WHERE scoring_players.team = ?
          ORDER BY percentage DESC
          LIMIT ?, ?
        `, [team, offset, limit], (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            connection.query(`
              SELECT COUNT(*) AS total 
              FROM scoring_players
              JOIN (SELECT team, season_years, SUM(team_score) AS team_total
                       FROM team_season_score
                       GROUP BY team, season_years) TS
              ON scoring_players.team = TS.team AND scoring_players.season_years = TS.season_years
              JOIN Player P ON scoring_players.player_id = P.player_id
              WHERE scoring_players.team = ?
            `, [team], (err, total) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                const totalPages = Math.ceil(total[0].total / limit);
                res.json({ data, totalPages });
              }
            });
          }
        });
      });
    }
  } catch (error) {
    console.error('Error during query:', error);
    res.status(500).send(error.message);
  }
};

// Route 15: GET /teams
/* Return name of teams for the autocomplete. */
const teams = async function(req, res) { 
console.log("hereQ3")
const sql = 
`SELECT DISTINCT team, team_name
FROM Team;`
const params = "";
connection.query(sql, params, (err, data) => {
if (err) {
console.log(err);
res.json({ err });
} else {
console.log(data)
res.json(data);
}
});
}

// Route 16: GET /player_names
/* Return name of teams for the autocomplete. */
const player_names = async function(req, res) { 
  console.log("hereQ3")
  const sql = 
  `SELECT DISTINCT first_name, last_name
  FROM Player;`
  const params = "";
  connection.query(sql, params, (err, data) => {
  if (err) {
  console.log(err);
  res.json({ err });
  } else {
  console.log(data)
  res.json(data);
  }
  });
  }
const player_data_landing_page = async function (req, res) {
  try {
    const sql = `
    SELECT * 
    FROM Player
    LIMIT 15
`;
    const params = "";
    connection.query(sql, params, (err, data) => {
      console.log(data);
      res.json(data);
    });

    // res.json(data);
  } catch (error) {
    // If an error is caught, send an error response
    console.error("Error during query:", error);
    res.status(500).send(error.message || "An error occurred during upload");
  }
};

// Route 17: GET /game_landing_page
const game_landing_page = async function (req, res) {
  try {
    const sql = `
    SELECT * 
    FROM Game
    LIMIT 15
`;
    const params = "";
    connection.query(sql, params, (err, data) => {
      console.log(data);
      res.json(data);
    });

    // res.json(data);
  } catch (error) {
    // If an error is caught, send an error response
    console.error("Error during query:", error);
    res.status(500).send(error.message || "An error occurred during upload");
  }
};

module.exports = {
player_database,
player_info,
game_table,
game_history,
player_comparison,
player_comparison_games,
match_predictions,
weather_insights,
fantasy_insights,
teammates,
weather_insights_teams_head_to_head,
player_historical_opponents,
player_comparison_with_weather_log,
connections,
contributors,
teams,
player_names,
player_data_landing_page,
game_landing_page
}  
