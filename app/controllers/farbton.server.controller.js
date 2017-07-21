var db = require('../../config/bookshelf.js')().knex
var cosmino = require('../models/cosmino.server.model.js')
const _ = require('lodash')
const moment = require('moment')
const pdf = require('html-pdf')

exports.list = function (req, res) {
  cosmino.Farbton().forge().fetchAll().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    console.error(err)
    res.status(500).json({error: true, data: {message: err.message}})
  })
}

exports.main = function (req, res, next) {
  res.firstDate = moment(req.params.first).hours(6).format()
  res.secondDate = moment(req.params.second).hours(6).format()

  grabFromDB(res.firstDate, function (first) {
    res.firstList = first
    grabFromDB(res.secondDate, function (second) {
      res.secondList = second

      next()
    })
  })
}

exports.getDiff = function (req, res, next) {
  var first = _.map(res.firstList, function (o) {
    return o.Materialkurztext + ' - ' + o.Farbton
  })
  var second = _.map(res.secondList, function (o) {
    return o.Materialkurztext + ' - ' + o.Farbton
  })
  res.ok = _.difference(first, second).sort()
  res.nok = _.difference(second, first).sort()

  next()
}

exports.createPdf = function (req, res, next) {
  var dateFirst = moment(res.firstDate).format('DD.MM.YYYY hh:mm')
  var dateSecond = moment(res.secondDate).format('DD.MM.YYYY hh:mm')
  res.render('cosmino/farbtonMessung', {
    list: res.secondList,
    firstList: res.firstList,
    dateFirst: dateFirst,
    dateSecond: dateSecond,
    ok: res.ok,
    nok: res.nok
  }, function (err, html) {
    if (err) next(err)

    pdf
      .create(html, {
        format: 'A4',
        border: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "15mm"
        }
      })
      .toFile('./tmp/Farbtonmessungen.pdf', function (err, file) {
        res.download(file.filename)
      })
    }
  )
}

function grabFromDB (date, callback) {
  db('Ft_Messungen')
    .innerJoin('farbton', 'Ft_Messungen.farbcode', 'farbton.Farbcode')
    .innerJoin('artikel', 'Ft_Messungen.typcode', 'artikel.Material')
    .innerJoin('Ft_Messintervalle', 'Ft_Messintervalle.artikel', 'Ft_Messungen.artikel' )
    .select('SID', 'datum', 'Farbton_io', 'Farbton_nio', 'Farbton_bio', 'mde', 'farbton.Farbton', 'artikel.Materialkurztext')
    .where('Ft_Messintervalle.prüfpflichtig', 1)
    .where('datum', '<', date)
    .asCallback(function (err, data) {
      if (err) throw err

      var result = getLastReading(data)
      return callback(result)
    })
}

function getLastReading (data) {
  var artikel = _.groupBy(data, 'Materialkurztext')
  var result = []

  _.each(artikel, function (value, index) {
    artikel[index] = _.groupBy(value, 'Farbton')
    _.each(artikel[index], function (innerValue, innerIndex) {
      var latest = _.maxBy(innerValue, 'datum')
      artikel[index][innerIndex] = latest

      // highlight Amarok as project
      if (_.words(latest.Materialkurztext)[0] === "Amarok") {
        _.assign(latest, {status: 'project'})
      } else {
        _.assign(latest, {status: 'serie'})
      }

      result.push(latest)
    })
  })

  result = _
    .chain(result)
    .filter({Farbton_nio: -1})
    .sortBy('datum')
    .reverse()
    .value()

  return result
}
