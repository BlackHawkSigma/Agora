var lackExport = require('../../app/controllers/export.server.controller')

module.exports = function (app) {
  app.route('/api/export').get(lackExport.list)
  app.route('/api/rejections').get(lackExport.listRejections)
}
