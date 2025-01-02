import express from 'express'
import { getAllEnvelopesController } from '../../../useCases/envelopes/getAll';
import { middleware } from '../../../../../shared/infra/http';
import { createEnvelopeController } from '../../../useCases/envelopes/create';
import { deleteEnvelopeController } from '../../../useCases/envelopes/delete';
import { getEnvelopeByIdController } from '../../../useCases/envelopes/getById';
import { updateEnvelopeNameController } from '../../../useCases/envelopes/updateName';
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
 * /envelopes/create:
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
envelopeRouter.post('/create',
  middleware.ensureAuthenticated(),
  (req, res) => createEnvelopeController.execute(req, res)
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
envelopeRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => deleteEnvelopeController.execute(req, res)
);

/**
 * @swagger
 * /envelopes/change-name/{id}:
 *   patch:
 *     summary: Change Name of an envelope
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

envelopeRouter.patch(
  '/update/:id',
  middleware.ensureAuthenticated(),
  (req, res) => updateEnvelopeNameController.execute(req, res)
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
envelopeRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => getEnvelopeByIdController.execute(req, res)
);



export { envelopeRouter };