var config = require('./config')
var knex = require('knex')(config.knex)

module.exports = function () {
  var bookshelf = require('bookshelf')(knex)

  bookshelf.plugin('registry')
  bookshelf.plugin('virtuals')

  return bookshelf
}
