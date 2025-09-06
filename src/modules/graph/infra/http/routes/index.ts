import express from 'express'
import { middleware } from '../../../../../shared/infrastructure/http';
import graphController from '../controller';

const graphRouter = express.Router();

/**
 * @swagger
 * /graph/analytics-current-envelopes/{year}/{month}:
 *   get:
 *     summary: Get Analytics Current Envelopes
 *     tags: [Graph]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: year of graph
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         description: month of graph
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: graph[]
 *       401:
 *         description: Unauthorized
  */
graphRouter.get('/analytics-current-envelopes/:year/:month',
  middleware.ensureAuthenticated(),
  (req, res) => graphController.getAnalyticsCurrentEnvelopes.execute(req, res)
);
/**
 * @swagger
 * /graph/analytics-envelopes-month-overview/{year}/{month}:
 *   get:
 *     summary: Get Analytics Current Envelopes
 *     tags: [Graph]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: year of graph
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         description: month of graph
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: graph[]
 *       401:
 *         description: Unauthorized
  */
graphRouter.get('/analytics-envelopes-month-overview/:year/:month',
  middleware.ensureAuthenticated(),
  (req, res) => graphController.getAnalyticsEnvelopesMonthOverview.execute(req, res)
);

/**
 * @swagger
 * /graph/analytics-envelopes-by-year/{year}:
 *   get:
 *     summary: Get Analytics Current Envelopes
 *     tags: [Graph]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: year of graph
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: graph[]
 *       401:
 *         description: Unauthorized
  */
graphRouter.get('/analytics-envelopes-by-year/:year',
  middleware.ensureAuthenticated(),
  (req, res) => graphController.getAnalyticsEnvelopesByYear.execute(req, res)
);



export { graphRouter };