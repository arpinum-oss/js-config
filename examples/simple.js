'use strict';

const config = require('../build');

const configuration = config({
  databaseUrl: {
    env: 'DATABASE_URL'
  },
  logLevel: {
    env: 'LOG_LEVEL',
    default: 'info'
  }
});

console.log(configuration);
