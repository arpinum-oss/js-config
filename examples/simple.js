'use strict';

const { loadConfiguration } = require('../build');

const configuration = loadConfiguration({
  databaseUrl: {
    env: 'DATABASE_URL'
  },
  logLevel: {
    env: 'LOG_LEVEL',
    default: 'info'
  }
});

console.log(configuration);
