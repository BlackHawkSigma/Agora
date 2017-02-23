var bookshelf = require('../../config/bookshelf.js')();
var cosmino = require('../models/cosmino.server.model.js');
var _ = require('lodash');

function limitOutput(data, filterArray) {
  var resultArray = [];
  var dummy = _.each(data, function(input) {
    var selection = _.pick(input, filterArray);
    resultArray.push(selection);
  });
  return resultArray;
};

var Export = bookshelf.Collection.extend({
  model: cosmino.Export()
});

var Artikel = bookshelf.Collection.extend({
  model: cosmino.Artikel()
});

exports.render = function(req, res) {
  res.render('dashboard/dashboard');
};

exports.list = function(req, res) {
  var exp = {};
  var art = {};

  var done = _.after(2, function() {
    _.forEach(exp, function(value, index) {
      var artikel = _.find(art, {'Material': value.typcode});
      if (artikel != undefined) {
        _.assign(value, {
          'rohteilWert': artikel.Rohteilpreis
        })
      } else {
        _.assign(value, {
          'rohteilWert': 0
        })
      }
    })

    res.json(limitOutput(exp, [
      'sid',
      'datum',
      'fehlerart.fehlerart_text',
      'artikeldaten.preis',
      'rohteilWert',
      'verwendung',
      'fahrweg',
      'artikelart'
    ]))
  });

  Export
    .query(function(qb) {
      qb.select(['sid', 'artikelcode', 'datum', 'fehlerart_code', 'io_notouch', 'io_poliert', 'nacharbeit', 'ausschuss', 'Fahrweg'])
        .whereBetween('datum', [req.query.startTime, req.query.endTime])
    })
    .fetch({
      withRelated: ['fehlerart', 'artikeldaten']
    })
    .then(function(result) {
      exp = result.toJSON()
      done()
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({error: true, data: {message: err.message}});
      next();
    })

  Artikel
    .forge()
    .fetch()
    .then(function(result) {
      art = result.toJSON()
      done()
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({error: true, data: {message: err.message}});
      next();
    })
}
