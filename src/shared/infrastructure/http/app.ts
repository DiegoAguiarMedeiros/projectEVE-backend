import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'dotenv/config';
import { v1Router } from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3039', 'http://192.168.70.2:3039'], 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))
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
    path.resolve(__dirname, '../../../modules/account/user/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/credit-card/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/debt/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/budgeting/envelope/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/budgeting/income/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/budgeting/fixed-expense/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/monthly-budget/monthly-envelope/infra/http/routes/*.js'),
    path.resolve(__dirname, '../../../modules/monthly-budget/transaction/infra/http/routes/*.js'),
  ],
};


const specs = swaggerJSDoc(options);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/', v1Router)
const port = process.env.PORT || 3000;

app.listen(Number(port), '0.0.0.0', () => {
  console.info('API rodando em http://0.0.0.0:3000');
})