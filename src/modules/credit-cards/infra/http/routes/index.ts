import express from 'express'
import { middleware } from '../../../../../shared/infrastructure/http';
import creditCardsController from '../controller';
const creditCardsRouter = express.Router();

/**
 * @swagger
 * /credit-cards:
 *   get:
 *     summary: Get all Credit Cards
 *     tags: [Credit Cards]
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
 *           enum: [name, flag]
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
 *         description: creditCards[]
 *       401:
 *         description: Unauthorized
  */
creditCardsRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardsController.getAll.execute(req, res)
);

/**
 * @swagger
 * /credit-cards:
 *   post:
 *     summary: Create Credit Card
 *     tags: [Credit Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the cardholder
 *               flag:
 *                 type: string
 *                 description: Credit card flag
 *                 enum:
 *                   - Visa
 *                   - Mastercard
 *                   - American Express
 *                   - Discover
 *                   - Diners Club
 *                   - JCB
 *                   - Elo
 *                   - Hipercard
 *     responses:
 *       200:
 *         description: Credit Card created successfully
 *       401:
 *         description: Unauthorized
 */

creditCardsRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardsController.create.execute(req, res)
)


/**
 * @swagger
 * /credit-cards/{id}:
 *   delete:
 *     summary: Delete an Credit Card
 *     tags: [Credit Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Credit Card ID
 *     responses:
 *       200:
 *         description: Credit Card deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Credit Card not found
 */
creditCardsRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardsController.delete.execute(req, res)
);

/**
 * @swagger
 * /credit-cards/{id}:
 *   patch:
 *     summary: Update an Credit Card
 *     tags: [Credit Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Credit Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               flag:
 *                 type: string
 *                 description: Credit card flag
 *                 enum:
 *                   - Visa
 *                   - Mastercard
 *                   - American Express
 *                   - Discover
 *                   - Diners Club
 *                   - JCB
 *                   - Elo
 *                   - Hipercard
 *     responses:
 *       200:
 *         description: Credit Card updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Credit Card not found
 */

creditCardsRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardsController.update.execute(req, res)
);

/**
 * @swagger
 * /credit-cards/{id}:
 *   get:
 *     summary: Get an Credit Card by ID
 *     tags: [Credit Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Credit Card ID
 *     responses:
 *       200:
 *         description: Credit Card retrieved successfully
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
 *         description: Credit Card not found
 */
creditCardsRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardsController.get.execute(req, res)
);



export { creditCardsRouter };