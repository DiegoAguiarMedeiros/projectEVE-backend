
import express from 'express'
import { creditCardRouter } from '../../../../modules/credit-card/infra/http/routes';
import { authRouter, userRouter } from '../../../../modules/account/user/infra/http/routes';
import { envelopeRouter } from '../../../../modules/budgeting/envelope/infra/http/routes';
import { fixedExpenseRouter } from '../../../../modules/budgeting/fixed-expense/infra/http/routes';
import { incomeRouter } from '../../../../modules/budgeting/income/infra/http/routes';
import { debtRouter } from '../../../../modules/debt/infra/http/routes';
import { monthlyEnvelopeRouter } from '../../../../modules/monthly-budget/monthly-envelope/infra/http/routes';
import { transactionRouter } from '../../../../modules/monthly-budget/transaction/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/envelope', envelopeRouter);
v1Router.use('/credit-card', creditCardRouter);
v1Router.use('/debt', debtRouter);
v1Router.use('/monthly-envelope', monthlyEnvelopeRouter);
v1Router.use('/fixed-expense', fixedExpenseRouter);
v1Router.use('/income', incomeRouter);
v1Router.use('/transaction', transactionRouter);

export { v1Router }