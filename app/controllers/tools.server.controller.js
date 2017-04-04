const csv = require('csv-parse')
const _ = require('lodash')
const seneca = require('../../config/seneca')()

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

exports.getSkidCirculations = function(req, res, next) {
  seneca.act({
    role: 'skidCounter',
    area: 'data',
    cmd: 'get'
  }, function(err, result) {
    if (err) return next(err)
    res.skidData = _.reject(result, {
      position: 'unbekannt'
    })
    next()
  })
}

exports.updateSkid = function(req, res, next) {
  seneca.act({
    role: 'DEsoftware',
    part: 'stammdaten',
    cmd: 'set_Skid',
    data: req.body.skid
  }, function(err, result) {
    next(err)
  })
}

exports.getSkidCounterUpdate = function(req, res) {
  res.render('tools/skidCirculations/input')
}
