import express from 'express';
import { middleware } from '../../../../../shared/infrastructure/http';
import processedIncomesController from '../controller';

const processedIncomesRouter = express.Router();

/**
 * @swagger
 * /processed-incomes:
 *   post:
 *     summary: Process Income
 *     tags: [Processed Incomes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: number
 *                 description: Day
 *               month:
 *                 type: number
 *                 description: Month
 *               year:
 *                 type: number
 *                 description: Year
 *               totalIncomeProcessed:
 *                 type: number
 *                 description: Amount of income to Process
 *               isSplitted:
 *                 type: boolean
 *                 description: Is income splitted
 *               auxId:
 *                 type: string
 *                 description: Auxiliary ID (optional)
 *     responses:
 *       200:
 *         description: Debt created successfully
 *       401:
 *         description: Unauthorized
 */

processedIncomesRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.create.execute(req, res)
)

/**
 * @swagger
 * /processed-incomes/months:
 *   get:
 *     summary: Get all Processed Incomes Month
 *     tags: [Processed Incomes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: YearMonths[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
  */
processedIncomesRouter.get('/months',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.getProcessedMonth.execute(req, res)
);

export { processedIncomesRouter };