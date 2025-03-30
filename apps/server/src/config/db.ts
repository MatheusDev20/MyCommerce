/* eslint-disable turbo/no-undeclared-env-vars */
export const DATABASE_CONFIGURATION = {
  port: process.env.PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL,
};
