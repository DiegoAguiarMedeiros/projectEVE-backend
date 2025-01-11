import express from 'express'
import { middleware } from '../../../../../shared/infra/http';
import { createTransactionController } from '../../../useCases/transactions/create';
import { deleteTransactionController } from '../../../useCases/transactions/delete';
import { getTransactionByIdController } from '../../../useCases/transactions/getById';
import { getAllTransactionController } from '../../../useCases/transactions/getAll';
import { updatedTransactionController } from '../../../useCases/transactions/update';
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
 *         description: transaction[]
 *       401:
 *         description: Unauthorized
  */
transactionsRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => getAllTransactionController.execute(req, res)
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create Transactions
 *     tags: [Transactions]
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

transactionsRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => createTransactionController.execute(req, res)
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
  (req, res) => deleteTransactionController.execute(req, res)
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
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

transactionsRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => updatedTransactionController.execute(req, res)
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
  (req, res) => getTransactionByIdController.execute(req, res)
);



export { transactionsRouter };