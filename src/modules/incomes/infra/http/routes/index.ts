import express from 'express';
import { middleware } from '../../../../../shared/infrastructure/http';
import incomesController from '../controller';

const incomesRouter = express.Router();

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Get all Incomes with pagination and sorting
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
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
 *           enum: [description, amount,payment_day]
 *         description: Column name to order by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction (ascending or descending)
 *     responses:
 *       200:
 *         description: Paginated list of Incomes
 *       401:
 *         description: Unauthorized
 */

incomesRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.getAll.execute(req, res)
);

/**
 * @swagger
 * /incomes/total:
 *   get:
 *     summary: Get all Incomes with pagination and sorting
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total of incomes
 *       401:
 *         description: Unauthorized
 */

incomesRouter.get('/total',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.getTotal.execute(req, res)
);


/**
 * @swagger
 * /incomes:
 *   post:
 *     summary: Create Income
 *     tags: [Incomes]
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
 *                 description: Amount of income
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Debt created successfully
 *       401:
 *         description: Unauthorized
 */

incomesRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.create.execute(req, res)
)


/**
 * @swagger
 * /incomes/{id}:
 *   delete:
 *     summary: Delete an Income
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Income ID
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Income not found
 */
incomesRouter.delete(
  '/delete-all',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.deleteAll.execute(req, res)
);

incomesRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.delete.execute(req, res)
);

/**
 * @swagger
 * /incomes/{id}:
 *   patch:
 *     summary: Update an Income
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Income ID
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
 *                 description: Amount of Income
 *               paymentDay:
 *                  type: string
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Income updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Income not found
 */

incomesRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.update.execute(req, res)
);

/**
 * @swagger
 * /incomes/{id}:
 *   get:
 *     summary: Get an Income by ID
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Income ID
 *     responses:
 *       200:
 *         description: Income retrieved successfully
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
 *         description: Income not found
 */
incomesRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => incomesController.get.execute(req, res)
);



export { incomesRouter };