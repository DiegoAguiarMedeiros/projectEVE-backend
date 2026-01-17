import express from 'express'
import { middleware } from '../../../../../shared/infrastructure/http';
import userController from '../controller';

const authRouter = express.Router();
const usersRouter = express.Router();

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
 * /users/me:
 *   get:
 *     summary: Login a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
usersRouter.get('/me',
  middleware.ensureAuthenticated(),
  (req, res) => userController.get.execute(req, res)
)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post('/logout',
  middleware.ensureAuthenticated(),
  (req, res) => userController.logout.execute(req, res)
)

usersRouter.post('/complete-registration',
  middleware.ensureAuthenticated(),
  (req, res) => userController.completeRegistration.execute(req, res)
)

export { authRouter, usersRouter };