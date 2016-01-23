## PhoneBuzz, Phase 3

As with phase 1 and 2, pull down the repo and run `npm install` in the root directory.

_Setup is the same as with phase 2:_

Before you start the server this time, it's important that you either hardcode your Twilio api token, account SID, and a valid Twilio number in OR create a config.js file in the server folder, exporting an object like so:

````
module.exports = {
  token: [YOUR-API_TOKEN],
  sid: [YOUR-ACCT-SID],
  number: [VALID-TWILIO-NUMBER]
};
````
Then, on line 33, the url used as an option to client.makeCall must be replaced with whatever host url or ngrok url you are using with the `/greet` endpoint added.

Now start the server with `node server/server.js`, this will run it on http://localhost:3000.

As before you must make the server accessible on an external ip

You can use ngrok for this purpose: `brew install ngrok` if you don't already have it, and then `ngrok 3000` with the server running.

The delay input can be in any of the following forms:

1h, 2m, 3s <br>
0h23m2s <br>
10s
