var bookshelf = require('../../config/bookshelf.js');
var cosmino = require('../models/cosmino.server.model.js');

exports.list = function(req, res) {
  cosmino.Farbton().forge().fetchAll().then(function(result) {
    res.json(result);
  }).catch(function(err) {
    console.error(err);
    res.status(500).json({error: true, data: {message: err.message}});
  });
};
