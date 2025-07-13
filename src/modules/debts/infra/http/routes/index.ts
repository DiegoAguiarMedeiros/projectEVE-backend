import express from 'express';
import { middleware } from '../../../../../shared/infrastructure/http';
import debtsController from '../controller';

const debtsRouter = express.Router();

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
 *         description: debts[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
  */
debtsRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => debtsController.getAll.execute(req, res)
);

/**
 * @swagger
 * /debts:
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

debtsRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => debtsController.create.execute(req, res)
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
debtsRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => debtsController.delete.execute(req, res)
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

debtsRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => debtsController.update.execute(req, res)
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
debtsRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => debtsController.get.execute(req, res)
);



export { debtsRouter };