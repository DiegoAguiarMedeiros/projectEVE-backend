import express from 'express'
import { middleware } from '../..';
import fixedExpenseController from '../../controllers/fixedExpense';

const fixedExpenseRouter = express.Router();

/**
 * @swagger
 * /fixed-expense:
 *   get:
 *     summary: Get all Fixed Expenses
 *     tags: [Fixed Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: FixedExpenses[]
 *       401:
 *         description: Unauthorized
  */
fixedExpenseRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpenseController.getAll.execute(req, res)
);

/**
 * @swagger
 * /fixed-expense:
 *   post:
 *     summary: Create Investment
 *     tags: [Fixed Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Name of the cardholder
 *               amount:
 *                 type: number
 *                 description: Amount of Investment
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Investment created successfully
 *       401:
 *         description: Unauthorized
 */

fixedExpenseRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpenseController.create.execute(req, res)
)


/**
 * @swagger
 * /fixed-expense/{id}:
 *   delete:
 *     summary: Delete an Investment
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Investment ID
 *     responses:
 *       200:
 *         description: Investment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */
fixedExpenseRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpenseController.delete.execute(req, res)
);

/**
 * @swagger
 * /fixed-expense/{id}:
 *   patch:
 *     summary: Update an Investment
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Investment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Name of the cardholder
 *               amount:
 *                 type: number
 *                 description: Amount of Investment
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Investment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */

fixedExpenseRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpenseController.update.execute(req, res)
);

/**
 * @swagger
 * /fixed-expense/{id}:
 *   get:
 *     summary: Get an Investment by ID
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Investment ID
 *     responses:
 *       200:
 *         description: Investment retrieved successfully
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
 *         description: Investment not found
 */
fixedExpenseRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpenseController.getAll.execute(req, res)
);



export { fixedExpenseRouter };