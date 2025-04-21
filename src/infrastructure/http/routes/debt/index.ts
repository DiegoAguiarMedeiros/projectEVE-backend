import express from 'express'
import { middleware } from '../..';
import debtController from '../../controllers/debt';
const debtRouter = express.Router();

/**
 * @swagger
 * /debt:
 *   get:
 *     summary: Get all Debts
 *     tags: [Debt]
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
debtRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => debtController.getAll.execute(req, res)
);

/**
 * @swagger
 * /debt:
 *   post:
 *     summary: Create Debt
 *     tags: [Debt]
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
 *               paymentDay:
 *                  type: string
 *                  format: date-time
 *                  description: Due Date
 *               status:
 *                 type: string
 *                 description: Debt Status
 *                 enum:
 *                   - Pending
 *                   - Paid
 *                   - Overdue
 *     responses:
 *       200:
 *         description: Debt created successfully
 *       401:
 *         description: Unauthorized
 */

debtRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => debtController.create.execute(req, res)
)


/**
 * @swagger
 * /debt/{id}:
 *   delete:
 *     summary: Delete an Debt
 *     tags: [Debt]
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
debtRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => debtController.delete.execute(req, res)
);

/**
 * @swagger
 * /debt/{id}:
 *   patch:
 *     summary: Update an Debt
 *     tags: [Debt]
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
 *               paymentDay:
 *                  type: string
 *                  format: date-time
 *                  description: Due Date
 *               status:
 *                 type: string
 *                 description: Debt Status
 *                 enum:
 *                   - Pending
 *                   - Paid
 *                   - Overdue
 *     responses:
 *       200:
 *         description: Debt updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
 */

debtRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => debtController.update.execute(req, res)
);

/**
 * @swagger
 * /debt/{id}:
 *   get:
 *     summary: Get an Debt by ID
 *     tags: [Debt]
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
debtRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => debtController.get.execute(req, res)
);



export { debtRouter };