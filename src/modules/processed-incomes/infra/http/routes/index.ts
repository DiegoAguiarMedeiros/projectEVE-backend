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


export { processedIncomesRouter };