const express = require("express");
const cors = require("cors");

// for Cypher query
require("dotenv").config();
var routesC = require("./cypher-routes"),
  nconf = require("./configC"),
  //swaggerJSDoc = require("swagger-jsdoc"),
  //swaggerUi = require("swagger-ui-express"),
  methodOverride = require("method-override"),
  //errorHandler = require("errorhandler"),
  bodyParser = require("body-parser")
  //setAuthUser = require("./middlewares/setAuthUser"),
  //neo4jSessionCleanup = require("./middlewares/neo4jSessionCleanup"),
  //writeError = require("./helpers/response").writeError;

  var api = express();
  api.use(
    cors({
      origin: "*",
    })
  );

//api.use(nconf.get("api_path"), api);

//api.set("port", nconf.get("PORT"));
//api.use(bodyParser.json());
//api.use(methodOverride());
api.get("/players", routesC.list);
api.get("/bacon/:firstname1/:lastname1/:firstname2/:lastname2", routesC.getBaconPeople);

//api error handler
var writeError = function writeError(res, error, status) {
  // sw.setHeaders(res);
  res
    .status(error.status || status || 400)
    .send(JSON.stringify(_.omit(error, ["status"])));
};

api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});

// hard coded for now
api.listen(nconf.get("PORT"), () => {
  console.log(
    "Cypher server listening on port " + nconf.get("PORT")
  );
});

// -------------------------------------------------------------------


const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/fantasy_insights", routes.fantasy_insights);
app.get("/player_info/:first_name/:last_name", routes.player_info);
app.get("/weather_insights/:game_date/:team", routes.weather_insights);
// app.get(
//   "/player_game_comparison/:firstName1/:lastName1/:firstName2/:lastName2",
//   routes.player_game_comparison
// );
app.get("/match_predictions/:team1?/:team2?", routes.match_predictions);
app.get(
  "/player_comparison/:firstName1?/:lastName1?/:firstName2?/:lastName2?",
  routes.player_comparison
);
app.get(
  "/player_comparison_games/:firstName1?/:lastName1?/:firstName2?/:lastName2?",
  routes.player_comparison_games
);
app.get("/player_database/", routes.player_database);
app.get("/teammates/:first_name?/:last_name?", routes.teammates);
app.get(
  "/weather_insights_teams_head_to_head",
  routes.weather_insights_teams_head_to_head
);
app.get("/player_historical_opponents", routes.player_historical_opponents);
app.get(
  "/player_comparison_with_weather_log",
  routes.player_comparison_with_weather_log
);
app.get("/player_data_landing_page", routes.player_data_landing_page);
app.get("/game_landing_page", routes.game_landing_page);

app.get("/player_names", routes.player_names);
app.get("/connections/:firstName1/:lastName1/:firstName2/:lastName2", routes.connections);
app.get("/contributors/:team?", routes.contributors);
app.get("/game_table", routes.game_table);
app.get("/game_history/:team1?/:team2?/:game_date?", routes.game_history);
app.get("/teams", routes.teams);


app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
