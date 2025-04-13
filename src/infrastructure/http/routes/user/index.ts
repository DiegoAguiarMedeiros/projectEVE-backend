import express from 'express'

import { middleware } from '../..';
import userController from '../../controllers/user';

const authRouter = express.Router();
const userRouter = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
authRouter.post('/',
  (req, res) => userController.create.execute(req, res)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post('/login',
  (req, res) => userController.login.execute(req, res)
)

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Login a user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/me',
  middleware.ensureAuthenticated(),
  (req, res) => userController.get.execute(req, res)
)

export { authRouter ,userRouter};