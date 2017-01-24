module.exports = function(app) {
  var farbton = require('../../app/controllers/farbton.server.controller');
  app.route('/farbtonListe').get(farbton.list);
  app.route('/farbton').get(farbton.render);
};
