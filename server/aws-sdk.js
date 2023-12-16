var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1', credentials: {
    accessKeyId : 'AKIA6LSTDUMIYR2OR6MM',
    secretAccessKey : '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'
}});

console.log("Access key:", AWS.config.credentials.accessKeyId);
console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
console.log("Region: ", AWS.config.region);

var NeptuneData = require('aws-sdk/clients/neptunedata');
var nep = new NeptuneData({
    apiVersion: '2023-08-01',
    region: 'us-east-1', 
    //endpoint: 'https://neptunedbcluster-ut66upcu0ady.cluster-caatjgd0wqmr.us-east-1.neptune.amazonaws.com',
    credentials: {
        accessKeyId : 'AKIA6LSTDUMIYR2OR6MM',
        secretAccessKey : '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'
    }
  });

  var params = {
    mode: 'basic'
  };
  var promise = nep.getPropertygraphSummary(params).promise();
  promise.then(function(data) {
    console.log('Success');
  }).catch(function(err) {
    console.log(err);
  });
  console.log('end');