var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');
var bodyparser = require('body-parser');
var approvalCode = "";
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use(bodyparser.json());
app.post('/visa', function(req, res) {
  var CCNumber = req.body.cc;
  var amount = req.body.amount;
  var expires = req.body.expires;
  console.log(CCNumber + "     " + amount);
  var data = JSON.stringify({
"acquirerCountryCode": "840",
"acquiringBin": "408999",
"amount": amount,
"businessApplicationId": "AA",
"cardAcceptor": {
"address": {
"country": "USA",
"county": "San Mateo",
"state": "CA",
"zipCode": "94404"
},
"idCode": "ABCD1234ABCD123",
"name": "Visa Inc. USA-Foster City",
"terminalId": "ABCD1234"
},
"cavv": "0700100038238906000013405823891061668252",
"foreignExchangeFeeTransaction": "11.99",
"localTransactionDateTime": "2017-06-10T15:51:45",
"retrievalReferenceNumber": "330000550000",
"senderCardExpiryDate": expires,
"senderCurrencyCode": "USD",
"senderPrimaryAccountNumber": CCNumber,
"surcharge": "11.99",
"systemsTraceAuditNumber": "451001"
});


	var req = request.defaults();


	var userId = 'M76KNDYY65HFCCB0E0IH21RR0_47x81uHwvqcwJN_kKUAjHCo';
	var password = 'ZZL4QhL0u29LozQYp';
	var keyFile = './keys/key_Bryan.pem';
	var certificateFile ='./keys/cert.pem';

	req.post({
	    uri : "https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pullfundstransactions",
	    key: fs.readFileSync(keyFile),
	    cert: fs.readFileSync(certificateFile),
	    headers: {
	      'Content-Type' : 'application/json',
	      'Accept' : 'application/json',
	      'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
	    },
	    body: data
	  }, function(error, response, body) {
	    if (!error) {
	      console.log("Response Code: " + response.statusCode);
	      console.log("Headers:");
	      for(var item in response.headers) {
	        console.log(item + ": " + response.headers[item]);
	      }
          approvalCode = JSON.parse(response.body);
          res.send(approvalCode.approvalCode);
	    } else {
	      console.log("Got error: " + error.message);
	    }
	  }
	);
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
