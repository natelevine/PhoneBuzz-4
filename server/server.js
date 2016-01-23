var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var app = express();
var crypto = require('crypto');
// Important! This config file is gitignored, and contains the api token, account sid, and Twilio phone number
var apiKeys = require('./config.js');
var db = require('./dbModels');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3000);
console.log('PhoneBuzz is now listening on port 3000');

// Serve up index.html
app.use(express.static(__dirname + '/../client'));

var client = require('twilio')(apiKeys.sid, apiKeys.token);

// Route that dials out to the number input into the input box
app.get('/call', function (req, res) {
  // Regular Expression to check if the string contains only numbers
  var numReg = new RegExp('^[0-9]+$');
  var input = req.query.phone;
  var numberString = input.split('-').join('');

  var delayString = req.query.delay.split(', ').join('');
  var delayValue = computeDelay(delayString);

  if (numReg.test(numberString) && numberString.length === 11) {
    if (delayValue >= 0) {
      // delegate the delay and call to the callOut function below
      callOut(delayValue, numberString);

      db.Call.create({
        number: numberString,
        delay: delayValue,
      }).then(function (call) {
        res.send('set delay for: ' + delayValue + ' seconds, and wrote to database')
      })
      // if computeDelay returned a -1, send back an error message
    } else {
      res.send('invalid delay');
    }
    // if the number doesn't match the regex, or isn't exactly 11 digits, send back a message
  } else {
    res.send('invalid number');
  }
});

// Main Twilio route, greet the user and take a number as input
app.get('/greet', function (req, res) {
  /*
     Attempt to verify the x-twilio-signature manually by hashing the full url with
     my auth-token as the key. This is almost exactly as described in the docs, but currently
     does not work. Possibly because of complications with tunneling (I used ngrok for testing)

     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
     var hash = crypto.createHmac('sha1', apiKeys.token).update(fullUrl).digest('base64');
     if (req.headers.x-twilio-signature === hash) {

     }
  */

  /*
     Second method for attempting to verify x-twilio-signature, using the built-in
     validateExpressRequest method. This method also does not currently work, even with
     the exact url as an option- as shown in the docs.

     var options = { url: 'http://69910e47.ngrok.com' };
     if (twilio.validateExpressRequest(req, apiKeys.token, options)) {

     }
  */
  var twimlResp = new twilio.TwimlResponse();
  // Gather the user input and redirect to /fizzbuzz route below
  twimlResp.say({ voice:'woman' }, 'Welcome to PhoneBuzz')
           .gather({
             action:'/fizzbuzz',
             method: 'GET',
             timeout: 30,
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

function computeDelay (delayString) {
  var result = 0;
  var currentStr = '';

  // For each character, if you see an 'h', 'm', or 's', calculate the appropriate
  // number of seconds to add. Otherwise, if you see a number, memoize it and keep iterating
  for (var i = 0; i < delayString.length; i++) {
    if (delayString.charAt(i) === 'h') {
      result += +currentStr * 3600;
      currentStr = '';
    } else if (delayString.charAt(i) === 'm') {
      result += +currentStr * 60;
      currentStr = '';
    } else if (delayString.charAt(i) === 's') {
      result += +currentStr;
      currentStr = '';
    } else if (typeof +delayString.charAt(i) === 'number') {
      currentStr += delayString.charAt(i);
    } else {
      // Found an invalid character
      return -1;
    }
  }
  return result;
}

// Sets a timeout for the user entered delay, then calls the entered number
function callOut (delay, numberString) {
  setTimeout(function () {
    client.makeCall({
      to: '+' + numberString,
      from: '+' + apiKeys.number,
      // breaks with a relative URL
      url: 'http://69910e47.ngrok.com/greet',
      // this must match the endpoint!
      method: 'GET'
    }, function (err, responseData) {
      if (err) {
        throw new Error('There was an error with the call: ', err);
      } else {
        console.log('making the call');
      }
    });
  }, delay * 1000);
}
