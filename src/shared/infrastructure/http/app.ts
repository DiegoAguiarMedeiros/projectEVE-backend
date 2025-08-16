import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'dotenv/config';
import { Router } from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import cookieParser from 'cookie-parser';

import models from '../database/sequelize/models'; // caminho para o index.ts dos models

(async () => {
  await models.sequelize.sync({ alter: true });
  // start app ...



  const app = express();

  const corsOptions = {
    origin: ['http://localhost:3039', 'http://192.168.70.2:3039'],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(cookieParser());

  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Project EVE API',
      version: '1.0.0',
      description: 'API documentation for Project EVE',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: [
      path.resolve(__dirname, '../../../modules/users/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/incomes/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/processed-incomes/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/credit-cards/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/debts/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/debts-transactions/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/envelopes/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/envelopes-transactions/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/fixed-expenses/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/goals/infra/http/routes/*.js'),
      path.resolve(__dirname, '../../../modules/transactions/infra/http/routes/*.js'),
    ],
  };


  const specs = swaggerJSDoc(options);


  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.use('/api/', Router)
  const port = process.env.PORT || 3000;

  app.listen(Number(port), '0.0.0.0', () => {
    console.info('API rodando em http://0.0.0.0:3000');
  })
})();