var mysql = require('mysql');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('phonebuzz', 'root', '');

var Call = sequelize.define('Call', {
  number: Sequelize.STRING,
  delay: Sequelize.STRING,
  digits: Sequelize.INTEGER
});

Call.sync();

exports.Call = Call;
