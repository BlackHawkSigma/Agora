var config = require('./config'),
    mysql = require('mysql');

module.exports = function() {
  var db = mysql.createPool(config.mysql);

  return db;
};
