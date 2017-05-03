var express = require('express');
var app = express();
let request = require('request-promise');

var i = 0;
var url = `https://mspbackups.com/v2.0/`;

// Change below

var Company = "Company";
var myToken = "myToken";
var AccountID = "AccountID";
var Destination = "Destination";
var PackageID = "PackageID"

request.get(url + 'api/Users/', {
  auth: {
    bearer: myToken
  }
}).then(res=> {
  body = JSON.parse(res);
  body.forEach(function(value){
    if (value.Company == Company) {
      console.log(value.DestinationList.length + ' => ' + value.ID);
      if (value.DestinationList.length > 0) {
        console.log('Deleting account for user ' + value.ID + ' ('+ value.Email +')');
        value.DestinationList.forEach(function(v){
          var options = {
              method: 'DELETE',
              uri: url + 'api/Destinations/' + v.ID + '?userId=' + value.ID,
              headers: {
                  'Authorization': 'BEARER ' + myToken,
                  'User-Agent': 'Request-Promise'
              },
              json: true
          };
          request(options)
            .then(function (body) {
            })
            .catch(function (err) {
              console.log(err)
            });

        });
      };
      console.log('Now adding account for user ' + value.ID + ' ('+ value.Email +')');
      var options = {
          method: 'POST',
          uri: url + 'api/Destinations/',
          body: {
            UserID: value.ID,
            AccountID: AccountID,
            Destination: Destination,
            PackageID: PackageID
          },
          headers: {
              'Authorization': 'BEARER ' + myToken,
              'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
      };

      request(options)
        .then(function (body) {
          // console.log(body)
        })
        .catch(function (err) {
          console.log(err)
        });

      console.log(value.DestinationList.length + ' => ' + value.ID);
      i++;


    };

  });
  console.log(i)

});

app.listen(3000, function() {
  console.log('listening on 3000')
})
