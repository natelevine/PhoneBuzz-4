var mysql = require('mysql');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('phonebuzz', 'root', '');

// Define the Call table (id and createdDate will be automatically added as columns)
var Call = sequelize.define('Call', {
  number: Sequelize.STRING,
  delay: Sequelize.STRING,
  digits: Sequelize.INTEGER
});

Call.sync();

exports.Call = Call;
