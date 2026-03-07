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
 *               description:
 *                 type: string
 *                 description: description
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

processedIncomesRouter.post('/process-all',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.processAll.execute(req, res)
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

/**
 * @swagger
 * /processed-incomes/total/{year}/{month}:
 *   get:
 *     summary: Get total Processed Incomes by Month
 *     tags: [Processed Incomes]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: year of processed income
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         description: month of processed income
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: total
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
  */
processedIncomesRouter.get('/total/:year/:month',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.getTotal.execute(req, res)
);
/**
 * @swagger
 * /processed-incomes/{year}/{month}:
 *   get:
 *     summary: Get total Processed Incomes by Month
 *     tags: [Processed Incomes]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: year of processed income
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         description: month of processed income
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: total
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Debt not found
  */
processedIncomesRouter.get('/:year/:month',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.getAll.execute(req, res)
);



/**
 * @swagger
 * /processed-incomes/{id}:
 *   put:
 *     summary: Update an Processed Incomes
 *     tags: [Processed Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Processed Incomes ID
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
 *               totalIncomeProcessed:
 *                 type: number
 *                 description: Total of Processed Incomes
 *     responses:
 *       200:
 *         description: Processed Incomes updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Processed Incomes not found
 */
processedIncomesRouter.put(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.update.execute(req, res)
);

processedIncomesRouter.delete(
  '/delete-all',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.deleteAll.execute(req, res)
);

processedIncomesRouter.delete(
  '/:year/:month',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.deleteByMonth.execute(req, res)
);

processedIncomesRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => processedIncomesController.delete.execute(req, res)
);
export { processedIncomesRouter };