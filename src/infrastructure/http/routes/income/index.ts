import express from 'express'
import { middleware } from '../..';
import incomeController from '../../controllers/income';

const incomeRouter = express.Router();

/**
 * @swagger
 * /income:
 *   get:
 *     summary: Get all Incomes with pagination and sorting
 *     tags: [Income]
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

incomeRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => incomeController.getAll.execute(req, res)
);


/**
 * @swagger
 * /income:
 *   post:
 *     summary: Create Income
 *     tags: [Income]
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
 *                 description: Amount of debt
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Debt created successfully
 *       401:
 *         description: Unauthorized
 */

incomeRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => incomeController.create.execute(req, res)
)


/**
 * @swagger
 * /income/{id}:
 *   delete:
 *     summary: Delete an Income
 *     tags: [Income]
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
incomeRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => incomeController.delete.execute(req, res)
);

/**
 * @swagger
 * /income/{id}:
 *   patch:
 *     summary: Update an Income
 *     tags: [Income]
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

incomeRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => incomeController.update.execute(req, res)
);

/**
 * @swagger
 * /income/{id}:
 *   get:
 *     summary: Get an Income by ID
 *     tags: [Income]
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
incomeRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => incomeController.get.execute(req, res)
);



export { incomeRouter };