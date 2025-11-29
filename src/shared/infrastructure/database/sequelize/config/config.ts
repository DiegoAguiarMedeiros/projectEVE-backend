import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { isProduction } from '../../../../../config';

dotenv.config();

const {
  PROJECT_EVE_DB_USER,
  PROJECT_EVE_DB_PASS,
  PROJECT_EVE_DB_HOST_DOCKER,
  PROJECT_EVE_DB_NAME,
  PROJECT_EVE_DB_DIALECT,
  PROJECT_EVE_DB_PORT,
  PROJECT_EVE_IS_PRODUCTION
} = process.env;

const dialectOptions =
  isProduction
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
    :
    {};



const sequelize = new Sequelize(PROJECT_EVE_DB_NAME as string, PROJECT_EVE_DB_USER as string, PROJECT_EVE_DB_PASS as string, {
  host: PROJECT_EVE_DB_HOST_DOCKER,
  dialect: PROJECT_EVE_DB_DIALECT as any,
  dialectOptions,
  port: Number(PROJECT_EVE_DB_PORT),
  logging: false,
});

export default sequelize;
