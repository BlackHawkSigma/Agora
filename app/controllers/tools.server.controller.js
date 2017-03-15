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
      throw err
    }
    seneca.act({
      role: 'robStatus',
      cmd: 'findMissing',
      csv: data
    }, function(err, result) {
      res.json(result)
    })
  })
}

var seneca = require('seneca')()
  .client({
    type: 'tcp',
    port: 10101,
    host: process.env.HOST_IP
  })
