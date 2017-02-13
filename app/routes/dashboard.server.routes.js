module.exports = function(app) {
  var view = require('../controllers/dashboard.server.controller.js');
  app.get('/dashboard', view.render);
}
