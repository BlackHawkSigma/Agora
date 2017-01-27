var artikel = require('../../app/controllers/artikel.server.controller');

module.exports = function(app) {
  app.route('/api/artikel').get(artikel.list);
};
