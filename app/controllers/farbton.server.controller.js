var sql = require('../../config/mysql.js')();

exports.list = function (req, res, next) {
  sql.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    }

    connection.query("SELECT * from farbton", function(err, rows, fields) {
      connection.release();

      if (!err) {
        res.json(rows);
      }
    });
  });
};

exports.render = function (req, res) {
  sql.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    }

    connection.query("SELECT * from farbton", function(err, rows, fields) {
      connection.release();

      if (!err) {
        res.render('farbton', {
          title: 'Farbton Liste',
          colors: rows
        });
      }
    });
  });
};
