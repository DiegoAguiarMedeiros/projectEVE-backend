const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const {
  PROJECT_EVE_DB_USER,
  PROJECT_EVE_DB_PASS,
  PROJECT_EVE_DB_HOST,
  PROJECT_EVE_DB_NAME,
  PROJECT_EVE_DB_DIALECT,
  PROJECT_EVE_DB_PORT,
} = process.env;

const sequelize = new Sequelize(PROJECT_EVE_DB_NAME, PROJECT_EVE_DB_USER, PROJECT_EVE_DB_PASS, {
  host: PROJECT_EVE_DB_HOST,
  dialect: PROJECT_EVE_DB_DIALECT,
  port: Number(PROJECT_EVE_DB_PORT),
  logging: false, // Defina como true para ver as queries SQL no console
});

module.exports = sequelize;
