import express from 'express'
import { middleware } from '../../../../../shared/infra/http';
import { createDebtController } from '../../../useCases/debts/create';
import { deleteDebtController } from '../../../useCases/debts/delete';
import { getDebtByIdController } from '../../../useCases/debts/getById';
import { getAllDebtController } from '../../../useCases/debts/getAll';
import { updatedDebtController } from '../../../useCases/debts/update';
const debt = express.Router();

/**
 * @swagger
 * /debts:
 *   get:
 *     summary: Get all Debts
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: debt[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
  */
debt.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => getAllDebtController.execute(req, res)
);

/*
{
  userId: string;
  creditCardId?: string;
  envelopeId: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: DebtsStatus;
}
*/

/**
 * @swagger
 * /debts/create:
 *   post:
 *     summary: Create Debt
 *     tags: [Debts]
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
 *                 description: Amount of debt
 *               installments_total:
 *                 type: number
 *                 description: Installments total
 *               installments_paid:
 *                 type: number
 *                 description: installments paid
 *               dueDate:
 *                  type: string
 *                  format: date-time
 *                  description: Due Date
 *               status:
 *                 type: string
 *                 description: Debt Status
 *                 enum:
 *                   - pending
 *                   - paid
 *                   - overdue
 *     responses:
 *       200:
 *         description: Debt created successfully
 *       401:
 *         description: Unauthorized
 */

debt.post('/create',
  middleware.ensureAuthenticated(),
  (req, res) => createDebtController.execute(req, res)
)


/**
 * @swagger
 * /debts/{id}:
 *   delete:
 *     summary: Delete an Debt
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Debt ID
 *     responses:
 *       200:
 *         description: Debt deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
 */
debt.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => deleteDebtController.execute(req, res)
);

/**
 * @swagger
 * /debts/{id}:
 *   patch:
 *     summary: Update an Debt
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Debt ID
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
 *                 description: Amount of debt
 *               installments_total:
 *                 type: number
 *                 description: Installments total
 *               installments_paid:
 *                 type: number
 *                 description: installments paid
 *               dueDate:
 *                  type: string
 *                  format: date-time
 *                  description: Due Date
 *               status:
 *                 type: string
 *                 description: Debt Status
 *                 enum:
 *                   - pending
 *                   - paid
 *                   - overdue
 *     responses:
 *       200:
 *         description: Debt updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
 */

debt.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => updatedDebtController.execute(req, res)
);

/**
 * @swagger
 * /debts/{id}:
 *   get:
 *     summary: Get an Debt by ID
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Debt ID
 *     responses:
 *       200:
 *         description: Debt retrieved successfully
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
 *         description: Debt not found
 */
debt.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => getDebtByIdController.execute(req, res)
);



export { debt };