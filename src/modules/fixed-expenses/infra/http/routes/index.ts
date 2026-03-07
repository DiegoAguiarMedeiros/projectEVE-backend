import express from 'express'
import { middleware } from '../../../../../shared/infrastructure/http';
import fixedExpensesController from '../controller';

const fixedExpensesRouter = express.Router();

/**
 * @swagger
 * /fixed-expenses:
 *   get:
 *     summary: Get all Fixed Expenses
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: orderBy
 *         schema:
 *           enum: [name, flag]
 *         description: Column name to order by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction (ascending or descending)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: FixedExpenses[]
 *       401:
 *         description: Unauthorized
  */
fixedExpensesRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.getAll.execute(req, res)
);

/**
 * @swagger
 * /fixed-expenses:
 *   post:
 *     summary: Create Fixed Expense
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
 *                 description: Amount of Fixed Expense
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Fixed Expense created successfully
 *       401:
 *         description: Unauthorized
 */

fixedExpensesRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.create.execute(req, res)
)


/**
 * @swagger
 * /fixed-expenses/{id}:
 *   delete:
 *     summary: Delete an Fixed Expense
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Fixed Expense ID
 *     responses:
 *       200:
 *         description: Fixed Expense deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fixed Expense not found
 */
fixedExpensesRouter.delete(
  '/delete-all',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.deleteAll.execute(req, res)
);

fixedExpensesRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.delete.execute(req, res)
);

/**
 * @swagger
 * /fixed-expenses/{id}:
 *   patch:
 *     summary: Update an Fixed Expense
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Fixed Expense ID
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
 *                 description: Amount of Fixed Expense
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Fixed Expense updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fixed Expense not found
 */

fixedExpensesRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.update.execute(req, res)
);

/**
 * @swagger
 * /fixed-expenses/{id}:
 *   get:
 *     summary: Get an Fixed Expense by ID
 *     tags: [Fixed Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Fixed Expense ID
 *     responses:
 *       200:
 *         description: Fixed Expense retrieved successfully
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
 *         description: Fixed Expense not found
 */
fixedExpensesRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.getAll.execute(req, res)
);



export { fixedExpensesRouter };