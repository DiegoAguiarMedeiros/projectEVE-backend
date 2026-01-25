import express from 'express'
import { middleware } from '../../../../../shared/infrastructure/http';
import transactionController from '../controller';

const transactionsRouter = express.Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all Transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: transactions[]
 *       401:
 *         description: Unauthorized
  */
transactionsRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.getAll.execute(req, res)
);
/**
 * @swagger
 * /transactions/envelope/{year}/{month}/{id}:
 *   get:
 *     summary: Get all Transactions by envelope
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: year of transactions
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         description: month of transactions
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Envelope ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: transactions[]
 *       401:
 *         description: Unauthorized
  */
transactionsRouter.get('/envelope/:year/:month/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.getAllByEnvelope.execute(req, res)
);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               envelopeId:
 *                 type: string
 *                 description: ID of the envelope
 *               description:
 *                 type: string
 *                 description: Description of the goal
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Target amount for the goal
 *               percentage:
 *                 type: number
 *                 format: float
 *                 description: Percentage of total allocation for this goal
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Deadline to achieve the goal
 *             required:
 *               - envelopeId
 *               - description
 *               - amount
 *               - percentage
 *               - deadline
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

transactionsRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.create.execute(req, res)
)


/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete an Transactions
 *     tags: [Transactions]
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
transactionsRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.delete.execute(req, res)
);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update an Transactions
 *     tags: [Transactions]
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
 *                   - envelope.transaction.payment_method.CreditCard
 *                   - envelope.transaction.payment_method.DebitCard
 *                   - envelope.transaction.payment_method.Cash
 *                   - envelope.transaction.payment_method.BankTransfer
 *                   - envelope.transaction.payment_method.eallocation
 *                   - envelope.transaction.payment_method.Pix
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
 *                   - transaction.status.pending
 *                   - transaction.status.completed
 *     responses:
 *       200:
 *         description: Transactions updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transactions not found
 */
transactionsRouter.put(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.update.execute(req, res)
);

/**
 * @swagger
 * /transactions/{id}/change-status:
 *   patch:
 *     summary: Change Transactions status
 *     tags: [Transactions]
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
 *                   - transaction.status.pending
 *                   - transaction.status.completed
 *     responses:
 *       200:
 *         description: Transactions updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transactions not found
 */

transactionsRouter.patch(
  '/:id/change-status',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.updateStatus.execute(req, res)
);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get an Transactions by ID
 *     tags: [Transactions]
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
transactionsRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => transactionController.get.execute(req, res)
);



export { transactionsRouter };