import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  PROJECT_EVE_DB_USER,
  PROJECT_EVE_DB_PASS,
  PROJECT_EVE_DB_HOST_DOCKER,
  PROJECT_EVE_DB_NAME,
  PROJECT_EVE_DB_DIALECT,
  PROJECT_EVE_DB_PORT
} = process.env;

console.log('PROJECT_EVE_DB_USER',PROJECT_EVE_DB_USER)
console.log('PROJECT_EVE_DB_PASS',PROJECT_EVE_DB_PASS)
console.log('PROJECT_EVE_DB_HOST_DOCKER',PROJECT_EVE_DB_HOST_DOCKER)
console.log('PROJECT_EVE_DB_NAME',PROJECT_EVE_DB_NAME)
console.log('PROJECT_EVE_DB_DIALECT',PROJECT_EVE_DB_DIALECT)
console.log('PROJECT_EVE_DB_PORT',PROJECT_EVE_DB_PORT)

const sequelize = new Sequelize(PROJECT_EVE_DB_NAME as string, PROJECT_EVE_DB_USER as string, PROJECT_EVE_DB_PASS as string, {
  host: PROJECT_EVE_DB_HOST_DOCKER,
  dialect: PROJECT_EVE_DB_DIALECT as any,
  port: Number(PROJECT_EVE_DB_PORT),
  logging: false, // Defina como true para ver as queries SQL no console
});

export default sequelize;
