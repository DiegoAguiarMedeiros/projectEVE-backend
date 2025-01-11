
import express from 'express'
import { authRouter } from '../../../../modules/users/infra/http/routes';
import { debtsRouter, envelopeRouter, creditCardsRouter, investmentsRouter, incomesRouter,transactionsRouter } from '../../../../modules/envelopes/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/envelopes', envelopeRouter);
v1Router.use('/credit-cards', creditCardsRouter);
v1Router.use('/debts', debtsRouter);
v1Router.use('/investments', investmentsRouter);
v1Router.use('/incomes', incomesRouter);
v1Router.use('/transactions', transactionsRouter);
// v1Router.use('/users', userRouter);
export { v1Router }