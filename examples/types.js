'use strict';

const config = require('../build');

const configuration = config({
  port: {
    env: 'PORT',
    type: 'integer'
  },
  pi: {
    env: 'PI',
    type: 'float'
  },
  answer: {
    env: 'ANSWER',
    type: 'boolean'
  }
});

console.log(configuration);
