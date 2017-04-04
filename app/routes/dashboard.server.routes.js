const tools = require('../controllers/tools.server.controller')

module.exports = function(app) {
  var dashboard = require('../controllers/dashboard.server.controller.js');
  app.get('/dashboard', dashboard.render);
  app.get('/api/dashboard', dashboard.list);
  app.get('/dashboard/skidCirculation', tools.getSkidCirculations, dashboard.renderSkidCirculation)
}
