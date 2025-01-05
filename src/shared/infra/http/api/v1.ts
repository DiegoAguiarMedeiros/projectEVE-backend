
import express from 'express'
import { authRouter } from '../../../../modules/users/infra/http/routes';
import { debt, envelopeRouter, creditCard, investments } from '../../../../modules/envelopes/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/envelopes', envelopeRouter);
v1Router.use('/credit-cards', creditCard);
v1Router.use('/debts', debt);
v1Router.use('/investments', investments);
// v1Router.use('/users', userRouter);

export { v1Router }