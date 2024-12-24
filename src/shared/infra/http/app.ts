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

const origin = {
  // origin: isProduction ? 'https://dddforum.com' : '*',
  origin: "*"
}

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(origin))
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))


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
};
const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../../../modules/users/infra/http/routes/*.js'), // Use absolute path
  ],
};


const specs = swaggerJSDoc(options);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/', v1Router)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`[App]: Listening on port ${port}`)
})
