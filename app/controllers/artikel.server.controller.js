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

    connection.query("SELECT * from artikel", function(err, rows, fields) {
      connection.release();

      if (!err) {
        res.json(rows);
      }
    });

    connection.on('error', function(err) {
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    });
  });
};
