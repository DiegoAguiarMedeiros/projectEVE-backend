
import express from 'express'
import { authRouter, userRouter } from './user';
import { creditCardRouter } from './creditCard';
import { debtsRouter } from './debt';
import { envelopeRouter } from './envelope';
import { incomesRouter } from './income';
import { investmentsRouter } from './investment';
import { transactionsRouter } from './transaction';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/envelopes', envelopeRouter);
v1Router.use('/credit-cards', creditCardRouter);
v1Router.use('/debts', debtsRouter);
v1Router.use('/investments', investmentsRouter);
v1Router.use('/incomes', incomesRouter);
v1Router.use('/transactions', transactionsRouter);

export { v1Router }