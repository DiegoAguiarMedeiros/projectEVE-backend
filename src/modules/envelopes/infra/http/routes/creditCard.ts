import express from 'express'
import { middleware } from '../../../../../shared/infra/http';
import { createCreditCardController } from '../../../useCases/creditCards/create';
import { deleteCreditCardController } from '../../../useCases/creditCards/delete';
import { getCreditCardByIdController } from '../../../useCases/creditCards/getById';
import { updateEnvelopeNameController } from '../../../useCases/envelopes/updateName';
import { getAllCreditCardsController } from '../../../useCases/creditCards/getAll';
import { updateCreditCardController } from '../../../useCases/creditCards/update';
const creditCard = express.Router();

/**
 * @swagger
 * /credit-cards:
 *   get:
 *     summary: Get all Credit Cards
 *     tags: [Credit Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: creditCards[]
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Credit Card not found
  */
creditCard.get('/',
  middleware.ensureAuthenticated(),
  (req, res) => getAllCreditCardsController.execute(req, res)
);

/**
 * @swagger
 * /credit-cards/create:
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

creditCard.post('/create',
  middleware.ensureAuthenticated(),
  (req, res) => createCreditCardController.execute(req, res)
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
creditCard.delete(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => deleteCreditCardController.execute(req, res)
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

creditCard.patch(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => updateCreditCardController.execute(req, res)
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
creditCard.get(
  '/:id',
  middleware.ensureAuthenticated(),
  (req, res) => getCreditCardByIdController.execute(req, res)
);



export { creditCard };