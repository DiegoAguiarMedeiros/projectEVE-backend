import express from 'express'
import { getAllEnvelopesController } from '../../../useCases/getAllEnvelopes';
import { middleware } from '../../../../../shared/infra/http';
const envelopeRouter = express.Router();

/**
 * @swagger
 * /envelopes:
 *   get:
 *     summary: Get all envelopes
 *     tags: [Envelopes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: envelopes[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enelopes not found
  */
envelopeRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => getAllEnvelopesController.execute(req, res)
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
// authRouter.post('/login',
//   (req, res) => loginController.execute(req, res)
// )

export { envelopeRouter };