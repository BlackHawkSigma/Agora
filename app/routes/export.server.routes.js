var lack5_export = require('../../app/controllers/export.server.controller');

module.exports = function(app) {
  app.route('/api/export').get(lack5_export.list);
  app.route('/api/rejections').get(lack5_export.listRejections);
};
