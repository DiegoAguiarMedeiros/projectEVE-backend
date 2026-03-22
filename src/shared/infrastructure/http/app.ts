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
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '192.168.15.7';
  const app = express();

  console.info(`Iniciando API em http://${host}:${port}`);
  const allowedOrigins = [
    process.env.PROJECT_EVE_FRONTEND_URL || 'https://projecteve-web.onrender.com',
    process.env.PROJECT_EVE_ADMIN_URL || 'http://localhost:5174',
  ].filter(Boolean);

  console.info(`origin URLS ${allowedOrigins.join(', ')}`);

  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

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
        url: `http://${host}:${port}/api`,
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
      path.resolve(__dirname, '../../../modules/graph/infra/http/routes/*.js'),
    ],
  };


  const specs = swaggerJSDoc(options);


  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.get('/', (req, res) => {
    res.json({ message: 'Project EVE API is running! Access /api or /api-docs for more info.' });
  });

  app.get('/api', (req, res) => {
    res.json({ message: 'API Project EVE is running!' });
  });

  app.use('/api/', Router)


  app.listen(Number(port), '0.0.0.0', () => {
    console.info(`API rodando em http://${host}:${port}`);
  })
})();