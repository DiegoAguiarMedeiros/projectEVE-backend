import express from 'express'
import { middleware } from '../../../../../shared/infrastructure/http';
import fixedExpensesController from '../controller';

const goalsRouter = express.Router();

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all Goals
 *     tags: [Goals]
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
goalsRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.getAll.execute(req, res)
);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create Goal
 *     tags: [Goals]
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
 *                 description: Amount of Goal
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Goal created successfully
 *       401:
 *         description: Unauthorized
 */

goalsRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.create.execute(req, res)
)


/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete an Goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Goal ID
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Goal not found
 */
/**
 * @swagger
 * /goals/delete-all:
 *   delete:
 *     summary: Delete all Goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All goals deleted successfully
 *       401:
 *         description: Unauthorized
 */
goalsRouter.delete(
  '/delete-all',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.deleteAll.execute(req, res)
);

goalsRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.delete.execute(req, res)
);

/**
 * @swagger
 * /goals/{id}:
 *   patch:
 *     summary: Update an Goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Goal ID
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
 *                 description: Amount of Goal
 *               paymentDay:
 *                  type: number
 *                  description: Payment Day
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Goal not found
 */

goalsRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.update.execute(req, res)
);

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Get an Goal by ID
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Goal ID
 *     responses:
 *       200:
 *         description: Goal retrieved successfully
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
 *         description: Goal not found
 */
goalsRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => fixedExpensesController.getAll.execute(req, res)
);



export { goalsRouter };