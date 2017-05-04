module.exports = function (app) {
  var view = require('../controllers/cosmino.server.controller.js')
  app.get('/cosmino/view', view.render)
  app.get('/cosmino/artikel', view.renderArtikel)
  app.get('/cosmino/farbton', view.renderFarbton)
}
