const http = require('http')
const debug = require('debug')('server')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

debug('starting app')

var express = require('./config/express')

debug('loading bookshelf')
require('./config/bookshelf')

var app = express()

debug('starting express server')

var port = (process.env.NODE_ENV === 'production' ? 80 : 3000)

http.createServer(app).listen(port, function () {
  debug('express running at port %s', port)
})

// crtl+c in Windows richtig interpretieren
if (process.platform === 'win32') {
  var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('SIGINT', function () {
    process.emit('SIGINT')
  })
}

// gracefully shut down everything
process.on('SIGINT', function () {
  debug('exiting...')
  process.exit()
})
