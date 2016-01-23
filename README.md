## PhoneBuzz, Phase 4

As with the other phases, pull down the repo and run `npm install` in the root directory.

_Basic setup is the same as with phase 3:_

Before you start the server, it's important that you either hardcode your Twilio api token, account SID, and a valid Twilio number in OR create a config.js file in the server folder, exporting an object like so:

````
module.exports = {
  token: [YOUR-API_TOKEN],
  sid: [YOUR-ACCT-SID],
  number: [VALID-TWILIO-NUMBER]
};
````
Then, on line 180, the url used as an option to client.makeCall must be replaced with whatever host url or ngrok url you are using.

_Setting up the database:_

For data storage, I chose to use a MySQL database with the npm Sequelize ORM module.

To set this up, make sure you have mysql installed in the command line and run `mysql.server start`. Next, get into your server with the root account (or whatever account you choose to have permissions), `mysql -u root -p`, and create the database with `create database phonebuzz;`

If you have the phonebuzz database and a mysql server running, Sequelize will automatically create the _Calls_ table for you.
_Note: you must replace the account and password on line 3 of the dbModels.js file with your account info and password_

Now start the server with `node server/server.js`, this will run it on http://localhost:3000.

As before you must make the server accessible on an external ip

You can use ngrok for this purpose: `brew install ngrok` if you don't already have it, and then `ngrok 3000` with the server running.

Pressing the re-call button will make the call to the same number, with the same delay, as stored in the database. It will skip the input step and proceed to directly read you fizzbuzz.
