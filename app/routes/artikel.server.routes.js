var artikel = require('../../app/controllers/artikel.server.controller');

module.exports = function(app) {
  app.route('/artikel').get(artikel.list);
};
