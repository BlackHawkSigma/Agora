var bookshelf = require('../../config/bookshelf.js');
var cosmino = require('../models/cosmino.server.model.js');

exports.list = function(req, res) {
  cosmino.Export()
    .query(function(qb) {
      qb.select('*')
        .whereBetween('datum', [req.query.startTime, req.query.endTime])
    })
    .fetchAll({
      withRelated: ['fehlerart', 'fehlerort']
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
      qb.select('*')
      .where('datum', '>', '2017-01-01 06:00:00')
    })
    .fetchAll({
      withRelated: ['artikel'],
      shallow: true
    })
    .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    console.error(err);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};
