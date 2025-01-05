import express from 'express'
import { middleware } from '../../../../../shared/infra/http';
import { createIncomeController } from '../../../useCases/incomes/create';
import { deleteIncomeController } from '../../../useCases/incomes/delete';
import { getIncomeByIdController } from '../../../useCases/incomes/getById';
import { getAllIncomeController } from '../../../useCases/incomes/getAll';
import { updatedIncomeController } from '../../../useCases/incomes/update';
const incomesRouter = express.Router();

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Get all Incomes
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Income[]
 *       401:
 *         description: Unauthorized
  */
incomesRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => getAllIncomeController.execute(req, res)
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
 *                 description: Amount of debt
 *               paymentDate:
 *                  type: string
 *                  format: date-time
 *                  description: Payment Date
 *     responses:
 *       200:
 *         description: Debt created successfully
 *       401:
 *         description: Unauthorized
 */

incomesRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => createIncomeController.execute(req, res)
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
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => deleteIncomeController.execute(req, res)
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
 *               paymentDate:
 *                  type: string
 *                  format: date-time
 *                  description: Payment Date
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
  (req, res) => updatedIncomeController.execute(req, res)
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
  (req, res) => getIncomeByIdController.execute(req, res)
);



export { incomesRouter };