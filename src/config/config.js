const dotenv = require('dotenv');

const environment = process.env.NODE_ENV || 'development';

let envFile;

switch (environment) {
  case 'development':
    envFile = '.env.dev';
    break;
  case 'production':
    envFile = '.env.prod';
    break;
  default:
    envFile = '.env.dev';
    break;
}

dotenv.config({ path: envFile });

const { DB_USER, DB_PWD, DB_NAME, DB_HOST, DB_PORT } = process.env;

if (!DB_USER || !DB_PWD || !DB_NAME || !DB_HOST || !DB_PORT) {
  throw new Error('Please provide env variables.');
}

const commonConfig = {
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres"
}

module.exports = {
  development: commonConfig,
  test: commonConfig,
  production: commonConfig
}
