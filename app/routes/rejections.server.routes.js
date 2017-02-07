module.exports = function(app) {
  var view = require('../controllers/rejections.server.controller.js');
  app.get('/rejections', view.render);
};
