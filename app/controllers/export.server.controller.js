var bookshelf = require('../../config/bookshelf.js')();
var cosmino = require('../models/cosmino.server.model.js');
var _ = require('lodash');

function limitOutput(data, filterArray) {
  var resultArray = [];
  var dummy = _.each(data.toJSON(), function(input) {
    var selection = _.pick(input, filterArray);
    resultArray.push(selection);
  });
  return resultArray;
};

var Export = bookshelf.Collection.extend({
  model: cosmino.Export()
});

exports.list = function(req, res) {
  Export
    .query(function(qb) {
      qb.select('*')
        .whereBetween('datum', [req.query.startTime, req.query.endTime])
    })
    .fetch({
      withRelated: ['fehlerart', 'fehlerort', 'artikeldaten']
    })
    .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    console.error(err);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};

exports.listRejections = function(req, res) {
  cosmino.Rejections()
    .query(function(qb) {
      qb.select('*');
      if (req.query.startTime != undefined) {
        qb.whereBetween('datum', [req.query.startTime, req.query.endTime]);
      }
    })
    .fetchAll({
      withRelated: ['artikel', 'fehlerart']
    })
    .then(function(result) {
      if (req.query.artikel != undefined) {
        var data = _.filter(result.toJSON(), function(data) {
          return _.startsWith(data.artikel.artikelbezeichnung, req.query.artikel);
        });
        res.send(data);
      } else {
        res.json(limitOutput(result, [
          'datum',
          'artikel.artikelbezeichnung',
          'fehlerart.fehlerart_text',
          'verwendung',
          'artikel.datum',
          'artikel.verwendung',
          'artikel.personalnummer',
          'artikel.typcode',
          'barcode'
        ]));
      }
  }).catch(function(err) {
    console.error(err);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};
