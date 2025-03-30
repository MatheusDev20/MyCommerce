import { Provider } from '@nestjs/common';
import knex from 'knex';
import { config } from 'src/config';

const pg = knex({
  client: 'pg',
  connection: {
    // connectionString: config.db. ATABASE_URL,
    host: config.db.DB_HOST,
    port: config.db.DB_PORT,
    user: config.db.DB_USER,
    database: config.db.DB_NAME,
    password: config.db.DB_PASSWORD,
    ssl: config.db.DB_SSL ? { rejectUnauthorized: false } : false,
  },
});

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

export const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: async () => {
    return pg;
  },
};
