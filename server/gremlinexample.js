/*
const gremlin = require('gremlin');
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

dc = new DriverRemoteConnection('wss://neptunedbcluster-ut66upcu0ady.cluster-ro-caatjgd0wqmr.us-east-1.neptune.amazonaws.com:8182/gremlin',{});

const graph = new Graph();
const g = graph.traversal().withRemote(dc);

g.V().limit(1).count().next().
    then(data => {
        console.log(data);
        dc.close();
    }).catch(error => {
        console.log('ERROR', error);
        dc.close();
    });
*/
var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1', credentials: {
    accessKeyId : 'AKIA6LSTDUMI4NTRYKVC',
    secretAccessKey : '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'
}});

console.log("Access key:", AWS.config.credentials.accessKeyId);
console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
console.log("Region: ", AWS.config.region);

const { NeptunedataClient, ExecuteGremlinQueryCommand, GetEngineStatusCommand } = require("@aws-sdk/client-neptunedata"); // CommonJS import
const client = new NeptunedataClient({
    endpoint: 'https://neptunedbcluster-ut66upcu0ady.cluster-ro-caatjgd0wqmr.us-east-1.neptune.amazonaws.com',
    accessKeyId:AWS.config.credentials.accessKeyId,
    secretAccessKey:AWS.config.credentials.secretAccessKey,
    region: AWS.config.region
});

/*
const { NeptuneClient, DescribeDBClustersCommand } = require("@aws-sdk/client-neptune"); // CommonJS import
const client2 = new NeptuneClient({
    endpoint: 'https://neptunedbcluster-ut66upcu0ady.cluster-ro-caatjgd0wqmr.us-east-1.neptune.amazonaws.com',
    accessKeyId:AWS.config.credentials.accessKeyId,
    secretAccessKey:AWS.config.credentials.secretAccessKey,
    region: AWS.config.region
});

const input = { // DescribeDBClustersMessage
    DBClusterIdentifier: "STRING_VALUE",
    Filters: [ // FilterList
      { // Filter
        Name: "STRING_VALUE", // required
        Values: [ // FilterValueList // required
          "STRING_VALUE",
        ],
      },
    ],
    MaxRecords: Number("int"),
    Marker: "STRING_VALUE",
  };
  const command = new DescribeDBClustersCommand();
  const response = client2.send(command);
  console.log(response.status);
*/


const input = { // ExecuteGremlinQueryInput
  gremlinQuery: "g.V().limit(1)"
};
//const command = new ExecuteGremlinQueryCommand(input);
const command = new GetEngineStatusCommand({});
const response = client.send(command);
console.log(response)
//response =  client.send(command);
// const response = await client.send(command);


/*
const { StartLoaderJobCommand } = require("@aws-sdk/client-neptunedata"); // CommonJS import
const create_input = { // StartLoaderJobInput
  source: "s3://nfl-graphdata/vertex_list.csv", // required
  format: "csv", // required
  s3BucketRegion: "us-east-1", // required
  iamRoleArn: "arn:aws:iam::986943038225:role/NeptuneQuickStart-NeptuneStac-NeptuneLoadFromS3Role-PoMwiPbboivX", // required
  failOnError: false,
  parallelism: "MEDIUM" ,
  updateSingleCardinalityProperties: false,
};
const loadCommand = new StartLoaderJobCommand(create_input);
const response = client.send(loadCommand);
// { // StartLoaderJobOutput
//   status: "STRING_VALUE", // required
//   payload: { // StringValuedMap // required
//     "<keys>": "STRING_VALUE",
//   },
// };
*/




// const ExecuteGremlinQueryCommand = require('neptunedata'); // CommonJS import

/*
var neptunedata = new AWS.Neptunedata(options = {
    endpoint: 'neptunedbcluster-ut66upcu0ady.cluster-ro-caatjgd0wqmr.us-east-1.neptune.amazonaws.com',
    accessKeyId:AWS.config.credentials.accessKeyId,
    secretAccessKey:AWS.config.credentials.secretAccessKey,
    region: AWS.config.region
});
const input = { // ExecuteGremlinQueryInput
    gremlinQuery: "g.V().limit(1)", // required
    // serializer: "STRING_VALUE",
  };
  const command = AWS.ExecuteGremlinQuery(input);
  // const response = await neptunedata.send(command);
  console.log(command.result)
*/

/*
const { NeptunedataClient, ExecuteGremlinQueryCommand } = require("@aws-sdk/client-neptunedata"); // CommonJS import
const client = new NeptunedataClient(config);
const input = { // ExecuteGremlinQueryInput
  gremlinQuery: "STRING_VALUE", // required
  serializer: "STRING_VALUE",
};
const command = new ExecuteGremlinQueryCommand(input);
const response = await client.send(command);
*/

