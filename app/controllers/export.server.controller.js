var bookshelf = require('../../config/bookshelf.js');
var cosmino = require('../models/cosmino.server.model.js');
var _ = require('lodash');

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
      qb.select('*');
      if (req.query.startTime != undefined) {
        qb.where('datum', '>=', req.query.startTime);
      }
    })
    .fetchAll({
      withRelated: ['artikel']
    })
    .then(function(result) {
      if (req.query.artikel != undefined) {
        var data = _.filter(result.toJSON(), function(data) {
          return _.startsWith(data.artikel.artikelbezeichnung, req.query.artikel);
        });
        res.send(data);
      } else {
        res.json(result);
      }
  }).catch(function(err) {
    console.error(err);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};
