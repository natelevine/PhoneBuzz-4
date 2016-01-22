## PhoneBuzz, Phase 1

To run, pull down the repo and run `npm install` in the root directory.

Start the server with `node server/server.js`, this will run it on http://localhost:3000.

However, since you must point a Twilio phone number to the app, it must either be hosted or tunneled to an external ip.

You can use ngrok for this purpose: `brew install ngrok`, and then `ngrok 3000` with the server running.

Point your Twilio app to the forwarded url that ngrok gives you, and you're good to go!
