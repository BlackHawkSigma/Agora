var config = require('./config'),
    mysql = require('mysql');

module.exports = function() {
  var db = mysql.createPool(require('./databaseConnection'));

  return db;
};
