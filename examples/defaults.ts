import { loadConfiguration } from '../lib';

const configuration = loadConfiguration(
  {
    log: {
      level: {
        env: 'LOG_LEVEL'
      }
    }
  },
  {
    defaults: {
      log: { level: 'debug' }
    }
  }
);

console.log(configuration);
