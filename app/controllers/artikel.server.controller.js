var bookshelf = require('../../config/bookshelf.js')
var cosmino = require('../models/cosmino.server.model.js')

exports.list = function (req, res) {
  cosmino.Artikel().forge().fetchAll().then(function (result) {
    res.json(result)
  }).catch(function (err) {
    console.error(err)
    res.status(500).json({error: true, data: {message: err.message}})
  })
}

var ArtikelDaten = bookshelf().Collection.extend({
  model: cosmino.ArtikelDaten()
})

exports.artikeldaten = function (req, res) {
  ArtikelDaten
    .fetch()
    .then(function (collection) {
      res.json(collection)
    })
    .catch(function (err) {
      console.log(err)
      res.status(500).json({error: true, data: {message: err.message}})
    })
}
