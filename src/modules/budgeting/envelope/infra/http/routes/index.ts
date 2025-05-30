import express from 'express';
import { middleware } from '../../../../../../shared/infrastructure/http';
import envelopeController from '../controller';

const envelopeRouter = express.Router();

/**
 * @swagger
 * /envelope:
 *   get:
 *     summary: Get all envelope
 *     tags: [Envelope]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: envelope[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enelopes not found
  */
envelopeRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.getAll.execute(req, res)
);

/**
 * @swagger
 * /envelope:
 *   post:
 *     summary: Create Envelope
 *     tags: [Envelope]
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
envelopeRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.create.execute(req, res)
)


/**
 * @swagger
 * /envelope/{id}:
 *   delete:
 *     summary: Delete an envelope
 *     tags: [Envelope]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The envelope ID
 *     responses:
 *       200:
 *         description: Envelope deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Envelope not found
 */
envelopeRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.delete.execute(req, res)
);

/**
 * @swagger
 * /envelope/{id}:
 *   patch:
 *     summary: Update an envelope
 *     tags: [Envelope]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The envelope ID
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

envelopeRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.update.execute(req, res)
);

/**
 * @swagger
 * /envelope/{id}:
 *   get:
 *     summary: Get an envelope by ID
 *     tags: [Envelope]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The envelope ID
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
envelopeRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.get.execute(req, res)
);



export { envelopeRouter };