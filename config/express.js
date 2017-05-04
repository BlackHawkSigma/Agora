const express = require('express')
const morgan = require('morgan')
const compress = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const favicon = require('serve-favicon')
const path = require('path')
const fs = require('fs')
const rfs = require('rotating-file-stream')

// Logging
var logDirectory = path.join(__dirname, '/../log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
})

module.exports = function () {
  var app = express()

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  } else if (process.env.NODE_ENV === 'production') {
    app.use(morgan('common'))
    app.use(morgan('[:date[iso]] :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms', {stream: accessLogStream}))
    app.use(compress())
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(methodOverride())

  app.set('view engine', 'pug')
  app.set('views', './app/views')

  app.use(express.static('./public'))
  app.use(favicon('./public/favicon.ico'))

  require('../app/routes/index.server.routes.js')(app)
  require('../app/routes/artikel.server.routes.js')(app)
  require('../app/routes/farbton.server.routes.js')(app)
  require('../app/routes/cosmino.server.routes.js')(app)
  require('../app/routes/export.server.routes.js')(app)
  require('../app/routes/rejections.server.routes.js')(app)
  require('../app/routes/dashboard.server.routes.js')(app)
  require('../app/routes/tools.server.routes.js')(app)

  return app
}
