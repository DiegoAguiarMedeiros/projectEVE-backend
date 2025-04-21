
import express from 'express'
import { authRouter, userRouter } from './user';
import { creditCardRouter } from './creditCard';
import { debtRouter } from './debt';
import { envelopeRouter } from './envelope';
import { incomeRouter } from './income';
import { fixedExpenseRouter } from './fixedExpense';
import { transactionRouter } from './transaction';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/envelope', envelopeRouter);
v1Router.use('/credit-card', creditCardRouter);
v1Router.use('/debt', debtRouter);
v1Router.use('/fixed-expense', fixedExpenseRouter);
v1Router.use('/income', incomeRouter);
v1Router.use('/transaction', transactionRouter);

export { v1Router }