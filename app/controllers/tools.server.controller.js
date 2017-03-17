const csv = require('csv-parse')

exports.render = function(req, res) {
  res.render('tools/robStatus/robstatus')
}

exports.getRobStatus = function(req, res) {
  csv(req.file.buffer, {
    auto_parse: true,
    columns: true,
    delimiter: ';'
  }, function(err, data) {
    if (err) {
      console.error(err)
      res.status(500).json({error: true, data: {message: err.message}})
    }
    seneca.act({
      role: 'robStatus',
      cmd: 'findMissing',
      csv: data
    }, function(err, result) {
      if (err) {
        console.error(err)
        res.status(500).json({error: true, data: {message: err.message}})
      }
      res.json(result)
    })
  })
}

var seneca = require('seneca')()
  .client({
    host: 'localhost'
  })
