module.exports = function(app) {
  var farbton = require('../../app/controllers/farbton.server.controller');
  app.route('/api/farbton').get(farbton.list);
};
