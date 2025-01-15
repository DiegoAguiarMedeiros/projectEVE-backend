import express from 'express'
import { middleware } from '../../../../../shared/infra/http';
import { createdInvestmensController } from '../../../useCases/investments/create';
import { deleteInvestmentsController } from '../../../useCases/investments/delete';
import { getInvestmentByIdController } from '../../../useCases/investments/getById';
import { getAllInvestmentsController } from '../../../useCases/investments/getAll';
import { updatedInvestmentsController } from '../../../useCases/investments/update';
const investmentsRouter = express.Router();

/**
 * @swagger
 * /investments:
 *   get:
 *     summary: Get all Investments
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Investments[]
 *       401:
 *         description: Unauthorized
  */
investmentsRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => getAllInvestmentsController.execute(req, res)
);

/*
{
  userId: string;
  creditCardId?: string;
  envelopeId: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: InvestmentsStatus;
}
*/

/**
 * @swagger
 * /investments:
 *   post:
 *     summary: Create Investment
 *     tags: [Investments]
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
 *               profitability:
 *                 type: number
 *                 description: Profitability of Investment - Year
 *               applicationDate:
 *                  type: string
 *                  format: date-time
 *                  description: Application Date
 *               maturityDate:
 *                  type: string
 *                  format: date-time
 *                  description: Maturity Date
 *               type:
 *                 type: string
 *                 description: Investment Status
 *                 enum:
 *                   - fixed_income
 *                   - variable_income
 *                   - real_estate
 *                   - crypto
 *                   - other
 *               status:
 *                 type: string
 *                 description: Investment Status
 *                 enum:
 *                   - active
 *                   - closed
 *                   - redeemed
 *     responses:
 *       200:
 *         description: Investment created successfully
 *       401:
 *         description: Unauthorized
 */

investmentsRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => createdInvestmensController.execute(req, res)
)


/**
 * @swagger
 * /investments/{id}:
 *   delete:
 *     summary: Delete an Investment
 *     tags: [Investments]
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
investmentsRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => deleteInvestmentsController.execute(req, res)
);

/**
 * @swagger
 * /investments/{id}:
 *   patch:
 *     summary: Update an Investment
 *     tags: [Investments]
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
 *               profitability:
 *                 type: number
 *                 description: Profitability of Investment - Year
 *               applicationDate:
 *                  type: string
 *                  format: date-time
 *                  description: Application Date
 *               maturityDate:
 *                  type: string
 *                  format: date-time
 *                  description: Maturity Date
 *               type:
 *                 type: string
 *                 description: Investment Status
 *                 enum:
 *                   - fixed_income
 *                   - variable_income
 *                   - real_estate
 *                   - crypto
 *                   - other
 *               status:
 *                 type: string
 *                 description: Investment Status
 *                 enum:
 *                   - active
 *                   - closed
 *                   - redeemed
 *     responses:
 *       200:
 *         description: Investment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Investment not found
 */

investmentsRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => updatedInvestmentsController.execute(req, res)
);

/**
 * @swagger
 * /investments/{id}:
 *   get:
 *     summary: Get an Investment by ID
 *     tags: [Investments]
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
investmentsRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => getInvestmentByIdController.execute(req, res)
);



export { investmentsRouter };