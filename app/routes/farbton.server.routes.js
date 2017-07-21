module.exports = function (app) {
  var farbton = require('../../app/controllers/farbton.server.controller')
  app.route('/api/farbton').get(farbton.list)
  app.get('/api/farbtonMessung/:first/:second', farbton.main, farbton.getDiff, farbton.createPdf)
}
