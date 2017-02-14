var bookshelf = require('../../config/bookshelf.js');
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

exports.render = function(req, res) {
  res.render('dashboard/dashboard');
};

exports.list = function(req, res) {
  cosmino.Export()
    .query(function(qb) {
      qb.select(['sid', 'datum', 'fehlerart_code', 'io_notouch', 'io_poliert', 'nacharbeit', 'ausschuss'])
        .whereBetween('datum', [req.query.startTime, req.query.endTime])
    })
    .fetchAll({
      withRelated: ['fehlerart']
    })
    .then(function(result) {
      res.json(limitOutput(result, [
        'datum',
        'fehlerart.fehlerart_text',
        'verwendung'
      ]));
  }).catch(function(err) {
    console.error(err);
    res.status(500).json({error: true, data: {message: err.message}});
  });
}
