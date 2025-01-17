import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'dotenv/config';
import { v1Router } from './api/v1';
import { isProduction } from '../../../config';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3039', 'http://192.168.70.6:3039'], // Especifique a origem do seu frontend
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'], // Métodos permitidos
  credentials: true, // Permite credenciais (cookies, autorizações, etc.)
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
        name: 'accessToken', // Nome do cookie
      },
    },
  },
  security: [
    {
      bearerAuth: [], // Aplica autenticação por padrão a todas as rotas
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../../../modules/users/infra/http/routes/*.js'), // Use absolute path
    path.resolve(__dirname, '../../../modules/envelopes/infra/http/routes/*.js'), // Use absolute path
  ],
};


const specs = swaggerJSDoc(options);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/', v1Router)
const port = process.env.PORT || 3000;

app.listen(Number(port), '0.0.0.0', () => {
  console.log('API rodando em http://0.0.0.0:3000');
})