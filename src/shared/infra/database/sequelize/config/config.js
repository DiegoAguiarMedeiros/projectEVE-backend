require('dotenv').config()
const Sequelize = require('sequelize');

const { 
  PROJECT_EVE_DB_USER, 
  PROJECT_EVE_DB_PASS, 
  PROJECT_EVE_DB_HOST,
  PROJECT_EVE_DB_DEV_DB_NAME,
  PROJECT_EVE_DB_TEST_DB_NAME,
  PROJECT_EVE_DB_PROD_DB_NAME,
  NODE_ENV,
  PROJECT_EVE_IS_PRODUCTION,
  CLEARDB_DATABASE_URL
} = process.env;

const databaseCredentials = {
  "development": {
    "username": PROJECT_EVE_DB_USER,
    "password": PROJECT_EVE_DB_PASS,
    "database": PROJECT_EVE_DB_DEV_DB_NAME,
    "host": PROJECT_EVE_DB_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": PROJECT_EVE_DB_USER,
    "password": PROJECT_EVE_DB_PASS,
    "database": PROJECT_EVE_DB_TEST_DB_NAME,
    "host": PROJECT_EVE_DB_HOST,
    "dialect": "mysql"
  },
  "production": {
    "username": PROJECT_EVE_DB_USER,
    "password": PROJECT_EVE_DB_PASS,
    "database": PROJECT_EVE_DB_PROD_DB_NAME,
    "host": PROJECT_EVE_DB_HOST,
    "dialect": "mysql"
  }
};

const { 
  username, password, database, host, dialect 
} = databaseCredentials[NODE_ENV];

module.exports = databaseCredentials;

const mode = PROJECT_EVE_IS_PRODUCTION === "true" ? 'prod' : 'dev';

console.log(`[DB]: Connecting to the database in ${mode} mode.`)

module.exports.connection = PROJECT_EVE_IS_PRODUCTION === "true"
  ? new Sequelize(CLEARDB_DATABASE_URL) 
  : new Sequelize(database, username, password, {
    host,
    dialect,
    port: 3306,
    dialectOptions: {
      multipleStatements: true,
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    logging: false
  }
);
