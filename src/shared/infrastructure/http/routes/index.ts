
import express from 'express'
import { creditCardsRouter } from '../../../../modules/credit-cards/infra/http/routes';
import { authRouter, usersRouter } from '../../../../modules/users/infra/http/routes';
import { envelopesRouter } from '../../../../modules/envelopes/infra/http/routes';
import { fixedExpensesRouter } from '../../../../modules/fixed-expenses/infra/http/routes';
import { goalsRouter } from '../../../../modules/goals/infra/http/routes';
import { incomesRouter } from '../../../../modules/incomes/infra/http/routes';
import { processedIncomesRouter } from '../../../../modules/processed-incomes/infra/http/routes';
import { debtsRouter } from '../../../../modules/debts/infra/http/routes';
import { transactionsRouter } from '../../../../modules/transactions/infra/http/routes';

const Router = express.Router();

Router.use('/auth', authRouter);
Router.use('/users', usersRouter);
Router.use('/incomes', incomesRouter);
Router.use('/processed-incomes', processedIncomesRouter);
Router.use('/credit-cards', creditCardsRouter);
Router.use('/debts', debtsRouter);
Router.use('/envelopes', envelopesRouter);
Router.use('/fixed-expenses', fixedExpensesRouter);
Router.use('/goals', goalsRouter);
Router.use('/transactions', transactionsRouter);

export { Router }