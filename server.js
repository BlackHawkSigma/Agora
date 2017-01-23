const http = require('http');
const debug = require('debug')('server');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express');
var mysql = require('./config/mysql');

var app = express();

debug('starting express server');

http.createServer(app).listen(3000, function() {
  debug('express running');
})
