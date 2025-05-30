import express from 'express';
import { middleware } from '../../../../../../shared/infrastructure/http';
import monthlyEnvelopeController from '../controller';

const monthlyEnvelopeRouter = express.Router();

/**
 * @swagger
 * /monthly-envelope:
 *   get:
 *     summary: Get all MonthlyEnvelope
 *     tags: [MonthlyEnvelope]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MonthlyEnvelope[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enelopes not found
  */
monthlyEnvelopeRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => monthlyEnvelopeController.getAll.execute(req, res)
);

/**
 * @swagger
 * /monthly-envelope:
 *   post:
 *     summary: Create Envelope
 *     tags: [MonthlyEnvelope]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Envelope created
 *       401:
 *         description: Unauthorized
 */
monthlyEnvelopeRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => monthlyEnvelopeController.create.execute(req, res)
)


/**
 * @swagger
 * /monthly-envelope/{id}:
 *   delete:
 *     summary: Delete an MonthlyEnvelope
 *     tags: [MonthlyEnvelope]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MonthlyEnvelope ID
 *     responses:
 *       200:
 *         description: Envelope deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Envelope not found
 */
monthlyEnvelopeRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => monthlyEnvelopeController.delete.execute(req, res)
);

/**
 * @swagger
 * /monthly-envelope/{id}:
 *   patch:
 *     summary: Update an MonthlyEnvelope
 *     tags: [MonthlyEnvelope]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MonthlyEnvelope ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Envelope updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Envelope not found
 */

monthlyEnvelopeRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => monthlyEnvelopeController.update.execute(req, res)
);

/**
 * @swagger
 * /monthly-envelope/{id}:
 *   get:
 *     summary: Get an MonthlyEnvelope by ID
 *     tags: [MonthlyEnvelope]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MonthlyEnvelope ID
 *     responses:
 *       200:
 *         description: Envelope retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Envelope not found
 */
monthlyEnvelopeRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => monthlyEnvelopeController.get.execute(req, res)
);



export { monthlyEnvelopeRouter };