var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  var twimlResp = new twilio.TwimlResponse();

  twimlResp.say({ voice:'woman' }, 'Welcome to PhoneBuzz')
           .gather({
             action:'/fizzbuzz',
             method: 'GET',
             timout: 30,
             finishOnKey: '#'
           }, function () {
                this.say({ voice: 'woman' }, 'Please enter a number, then press pound');
           });

  res.type('text/xml');
  res.send(twimlResp.toString());
});

app.get('/fizzbuzz', function(req, res) {
  var twimlResp = new twilio.TwimlResponse();
  var fizzBuzzResponse = fizzBuzz(req.query.Digits);

  twimlResp.say({ voice: 'woman' }, fizzBuzzResponse)
           .say({ voice: 'woman' }, 'Thanks for playing!');
  res.type('text/xml');
  res.send(twimlResp.toString());
});

app.listen(3000);
console.log('PhoneBuzz is now listening on port 3000');

function fizzBuzz (n) {
  var fizzBuzzString = '';

  for (var i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      fizzBuzzString += 'Fizz Buzz, ';
    } else if (i % 3 === 0) {
      fizzBuzzString += 'Fizz, ';
    } else if (i % 5 === 0) {
      fizzBuzzString += 'Buzz, ';
    } else {
      fizzBuzzString += i + ', ';
    }
  }
  fizzBuzzString.substr(0, fizzBuzzString.length-2);
  console.log(fizzBuzzString);
  return fizzBuzzString;
}
