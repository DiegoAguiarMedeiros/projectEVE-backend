import express from 'express'
import { middleware } from '../..';
import creditCardController from '../../controllers/creditCard';
const creditCardRouter = express.Router();

/**
 * @swagger
 * /credit-card:
 *   get:
 *     summary: Get all Credit Cards
 *     tags: [Credit Card]
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
creditCardRouter.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardController.getAll.execute(req, res)
);

/**
 * @swagger
 * /credit-card:
 *   post:
 *     summary: Create Credit Card
 *     tags: [Credit Card]
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

creditCardRouter.post('/',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardController.create.execute(req, res)
)


/**
 * @swagger
 * /credit-card/{id}:
 *   delete:
 *     summary: Delete an Credit Card
 *     tags: [Credit Card]
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
creditCardRouter.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardController.delete.execute(req, res)
);

/**
 * @swagger
 * /credit-card/{id}:
 *   patch:
 *     summary: Update an Credit Card
 *     tags: [Credit Card]
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

creditCardRouter.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardController.update.execute(req, res)
);

/**
 * @swagger
 * /credit-card/{id}:
 *   get:
 *     summary: Get an Credit Card by ID
 *     tags: [Credit Card]
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
creditCardRouter.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => creditCardController.get.execute(req, res)
);



export { creditCardRouter };