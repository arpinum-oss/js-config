import { loadConfiguration } from '../lib';

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
