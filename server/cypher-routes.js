const mysql = require('mysql2')
const config = require('./config.json')
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.database
    });
connection.connect((err) => err && console.log(err));

const Player = require('./Player')
  , _ = require('lodash')
  , dbUtils = require('./dbUtils');

  // var sw = require("swagger-node-express");


const writeResponse = function writeResponse(res, response, status) {
  // sw.setHeaders(res);
  res.status(status || 200).send(JSON.stringify(response));
};
const writeError = function writeError(res, error, status) {
  // sw.setHeaders(res);
  res
    .status(error.status || status || 400)
    .send(JSON.stringify(_.omit(error, ["status"])));
};

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

// HELPERS
// return many people
function _manyPeople(neo4jResult) {
    return neo4jResult.records.map(r => new Player(r.get('p')))
  }

// get all people
const getAll = function (session) {
    console.log('Getting all players');
    return session.readTransaction(txc =>
        txc.run('MATCH (p:Player) RETURN p')
      ).then(result => _manyPeople(result));
  };

// ROUTES

const list = function (req, res, next) {
    getAll(dbUtils.getSession(req))
      .then(response => writeResponse(res, response))
      .catch(next);
  };

// http://localhost:3000/bacon/akeemdent%2F2495276/akeemhunt%2F2553660
// peytonmanning/2501863
// a.j.edds/496921
// tombrady/2504211
// http://localhost:3000/bacon/Tom/Brady/Peyton/Manning
const getBaconPeople = async function (req, res, next) {
    var name1;
    var name2;
    const p1_first = req.params.firstname1;
    const p1_last = req.params.lastname1;
  const p2_first = req.params.firstname2;
  const p2_last = req.params.lastname2;
  console.log("start name: " + p1_first+" "+p1_last)
  console.log("end name: " + p2_first+" "+p2_last)
  if (!p1_first || !p1_last || !p2_first || !p2_last) {
    res.status(400).send('Missing one/both names.');
    return;
  }
  if ((p1_first == p2_first) && (p1_last == p2_last)) {
    res.status(400).send('Players cannot be the same');
    return;
  }
  try {
    const p1 = await get__playerID(p1_first, p1_last);
    const p2 = await get__playerID(p2_first, p2_last);
    name1 = p1[0].player_id;
    name2 = p2[0].player_id;
    //const name1 = req.params.name1;
    //const name2 = req.params.name2;
  } catch (error) {
    console.error('Error during query:', error);
    res.status(500).send(error.message);
  }
  const getBaconPeopleF = function (session, name1, name2) {
    const query = [
      'MATCH p = shortestPath( (p1:Player {user: $name1 })-[:TEAMMATE*]-(target:Player {user: $name2 }) )',
      'WITH [n IN nodes(p) WHERE n:Player | n] as bacon',
      'UNWIND(bacon) AS p',
      'RETURN DISTINCT p'
    ].join('\n');
    console.log(query);
    return session.readTransaction(txc =>
        txc.run(query, {
          name1: name1,
          name2: name2
        })
      ).then(result => _manyPeople(result))
  };
  getBaconPeopleF(dbUtils.getSession(req), name1, name2)
  .then(response => writeResponse(res, response))
  .catch(next);
};

module.exports = {
    list,
    getBaconPeople,
}  