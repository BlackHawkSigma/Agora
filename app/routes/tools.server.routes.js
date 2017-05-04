var tools = require('../controllers/tools.server.controller.js')
const multer = require('multer')
const upload = multer()

module.exports = function (app) {
  app.get('/tools', tools.render)
  app.route('/api/tools/robStatus')
    .post(upload.single('file'), tools.getRobStatus)
    .get(tools.getRobStatus)
  app.route('/api/tools/skidCounter')
    .post(tools.updateSkid, function (req, res) {
      res.redirect('/dashboard/skidCirculation')
    })
    .get(tools.getSkidCounterUpdate)
}
