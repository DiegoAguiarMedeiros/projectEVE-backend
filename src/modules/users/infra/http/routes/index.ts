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

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user email address
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
authRouter.get('/verify-email',
  (req, res) => userController.verifyEmail.execute(req, res)
)

/**
 * @swagger
 * /users/complete-registration:
 *   post:
 *     summary: Complete user registration with additional profile data
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency:
 *                 type: string
 *                 description: Preferred currency
 *               language:
 *                 type: string
 *                 description: Preferred language
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registration completed successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.post('/complete-registration',
  middleware.ensureAuthenticated(),
  (req, res) => userController.completeRegistration.execute(req, res)
)

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 description: User email
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.put('/profile',
  middleware.ensureAuthenticated(),
  (req, res) => userController.update.execute(req, res)
)

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid current password
 */
usersRouter.put('/change-password',
  middleware.ensureAuthenticated(),
  (req, res) => userController.changePassword.execute(req, res)
)

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete authenticated user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.delete('/me',
  middleware.ensureAuthenticated(),
  (req, res) => userController.deleteAccount.execute(req, res)
)

export { authRouter, usersRouter };