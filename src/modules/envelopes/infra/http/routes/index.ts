import express from 'express';
import { middleware } from '../../../../../shared/infrastructure/http';
import envelopeController from '../controller';

const envelopesRouter = express.Router();

/**
 * @swagger
 * /envelopes:
 *   get:
 *     summary: Get all envelope
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
envelopesRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.getAll.execute(req, res)
);

/**
 * @swagger
 * /envelopes:
 *   post:
 *     summary: Create Envelope
 *     tags: [Envelopes]
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
envelopesRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.create.execute(req, res)
)


/**
 * @swagger
 * /envelopes/{id}:
 *   delete:
 *     summary: Delete an envelope
 *     tags: [Envelopes]
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
envelopesRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.delete.execute(req, res)
);

/**
 * @swagger
 * /envelopes/{id}:
 *   patch:
 *     summary: Update an envelope
 *     tags: [Envelopes]
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

envelopesRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.update.execute(req, res)
);

/**
 * @swagger
 * /envelopes/{id}:
 *   get:
 *     summary: Get an envelope by ID
 *     tags: [Envelopes]
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
envelopesRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => envelopeController.get.execute(req, res)
);



export { envelopesRouter };