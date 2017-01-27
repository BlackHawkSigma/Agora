var config = require('./config'),
    knex = require('knex')(config.knex);

module.exports = require('bookshelf')(knex);
