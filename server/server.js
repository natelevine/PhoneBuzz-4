var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var app = express();
var crypto = require('crypto');
var key = require('./config.js').key;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3000);
console.log('PhoneBuzz is now listening on port 3000');

// Main route, greet the user and take a number as input
app.get('/', function (req, res) {
  /*
     Attempt to verify the x-twilio-signature manually by hashing the full url with
     my auth-token as the key. This is almost exactly as described in the docs, but currently
     does not work. Possibly because of complications with tunneling (I used ngrok for testing)

     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
     var hash = crypto.createHmac('sha1', key).update(fullUrl).digest('base64');
     if (req.headers.x-twilio-signature === hash) {

     }
  */

  /*
     Second method for attempting to verify x-twilio-signature, using the built-in
     validateExpressRequest method. This method also does not currently work, even with
     the exact url as an option- as shown in the docs.

     var options = { url: 'http://69910e47.ngrok.com' };
     if (twilio.validateExpressRequest(req, key, options)) {

     }
  */
  var twimlResp = new twilio.TwimlResponse();
  // Gather the user input and redirect to /fizzbuzz route below
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

// FizzBuzz redirect route, calculates the proper sequence and reads the results out
app.get('/fizzbuzz', function(req, res) {
  var twimlResp = new twilio.TwimlResponse();
  // req.query.Digits grabs the user's input from the query string
  var fizzBuzzResponse = fizzBuzz(req.query.Digits);

  twimlResp.say({ voice: 'woman' }, fizzBuzzResponse)
           .say({ voice: 'woman' }, 'Thanks for playing!');
  res.type('text/xml');
  res.send(twimlResp.toString());
});

// Calculate fizzbuzz up to the user's input and write it to a string
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
  // Cut the space and extra comma off the end and replace with a period
  fizzBuzzString = fizzBuzzString.substr(0, fizzBuzzString.length-2) + '.';
  return fizzBuzzString;
};
