import express from 'express'
import { middleware } from '../..';
import transactionController from '../../controllers/transaction';

const transactionRouter = express.Router();

/**
 * @swagger
 * /transaction:
 *   get:
 *     summary: Get all Transactions
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: transaction[]
 *       401:
 *         description: Unauthorized
  */
transactionRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.getAll.execute(req, res)
);
/**
 * @swagger
 * /transaction/envelope/{id}:
 *   get:
 *     summary: Get all Transactions by envelope
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transactions ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: transaction[]
 *       401:
 *         description: Unauthorized
  */
transactionRouter.get('/envelope/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.getAllByEnvelope.execute(req, res)
);

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Create Transactions
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               creditCardId:
 *                 type: string
 *                 description: Credit Card Id
 *               envelopeId:
 *                 type: string
 *                 description: Envelope Id
 *               description:
 *                 type: string
 *                 description: Name of the cardholder
 *               amount:
 *                 type: number
 *                 description: Amount of Transactions
 *               paymentMethod:
 *                 type: string
 *                 description: Payment Method
 *                 enum:
 *                   - CreditCard
 *                   - DebitCard
 *                   - Cash
 *                   - BankTransfer
 *                   - Pix
 *               date:
 *                  type: string
 *                  format: date-time
 *                  description: Date
 *               type:
 *                 type: string
 *                 description: Transactions type
 *                 enum:
 *                   - Credit
 *                   - Debit
 *               status:
 *                 type: string
 *                 description: Transactions Status
 *                 enum:
 *                   - Pending
 *                   - Completed
 *     responses:
 *       200:
 *         description: Transactions created successfully
 *       401:
 *         description: Unauthorized
 */

transactionRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.create.execute(req, res)
)


/**
 * @swagger
 * /transaction/{id}:
 *   delete:
 *     summary: Delete an Transactions
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transactions ID
 *     responses:
 *       200:
 *         description: Transactions deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transactions not found
 */
transactionRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.delete.execute(req, res)
);

/**
 * @swagger
 * /transaction/{id}:
 *   put:
 *     summary: Update an Transactions
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transactions ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               creditCardId:
 *                 type: string
 *                 description: Credit Card Id
 *               envelopeId:
 *                 type: string
 *                 description: Envelope Id
 *               description:
 *                 type: string
 *                 description: Name of the cardholder
 *               amount:
 *                 type: number
 *                 description: Amount of Transactions
 *               paymentMethod:
 *                 type: string
 *                 description: Payment Method
 *                 enum:
 *                   - CreditCard
 *                   - DebitCard
 *                   - Cash
 *                   - BankTransfer
 *                   - Pix
 *               date:
 *                  type: string
 *                  format: date-time
 *                  description: Date
 *               type:
 *                 type: string
 *                 description: Transactions type
 *                 enum:
 *                   - Credit
 *                   - Debit
 *               status:
 *                 type: string
 *                 description: Transactions Status
 *                 enum:
 *                   - Pending
 *                   - Completed
 *     responses:
 *       200:
 *         description: Transactions updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transactions not found
 */

transactionRouter.put(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.update.execute(req, res)
);

/**
 * @swagger
 * /transaction/{id}/change-status:
 *   patch:
 *     summary: Change Transactions status
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transactions ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Transactions Status
 *                 enum:
 *                   - Pending
 *                   - Completed
 *     responses:
 *       200:
 *         description: Transactions updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transactions not found
 */

transactionRouter.patch(
  '/:id/change-status',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.updateStatus.execute(req, res)
);

/**
 * @swagger
 * /transaction/{id}:
 *   get:
 *     summary: Get an Transactions by ID
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transactions ID
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *         description: Transactions not found
 */
transactionRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.get.execute(req, res)
);



export { transactionRouter };