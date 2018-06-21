import { loadConfiguration } from '../lib';

const configuration = loadConfiguration({
  databaseUrl: {
    env: ['DATABASE_URL', 'DB_URL', 'PG_URL'],
    required: true
  }
});

console.log(configuration);
