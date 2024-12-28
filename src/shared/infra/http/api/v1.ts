
import express from 'express'
import { authRouter } from '../../../../modules/users/infra/http/routes';
import { envelopeRouter } from '../../../../modules/envelopes/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/envelopes', envelopeRouter);
// v1Router.use('/users', userRouter);

export { v1Router }