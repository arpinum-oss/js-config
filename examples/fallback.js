'use strict';

const config = require('../build');

const configuration = config({
  databaseUrl: {
    env: ['DATABASE_URL', 'DB_URL', 'PG_URL'],
    required: true
  }
});

console.log(configuration);
