import express from 'express';
import { middleware } from '../../../../../shared/infrastructure/http';
import adminController from '../controller';

const adminRouter = express.Router();

const auth = [middleware.ensureAuthenticated(), middleware.ensureAdmin()];

// Stats
adminRouter.get('/stats', auth, (req: any, res: any) => adminController.getStats.execute(req, res));
adminRouter.get('/stats/:type', auth, (req: any, res: any) => adminController.getStatsByMonth.execute(req, res));

// Users
adminRouter.get('/users', auth, (req: any, res: any) => adminController.getAllUsers.execute(req, res));
adminRouter.get('/users/:id', auth, (req: any, res: any) => adminController.getUserById.execute(req, res));
adminRouter.patch('/users/:id', auth, (req: any, res: any) => adminController.updateUser.execute(req, res));
adminRouter.delete('/users/:id', auth, (req: any, res: any) => adminController.deleteUser.execute(req, res));

// User sub-resources
adminRouter.get('/users/:userId/envelopes', auth, (req: any, res: any) => adminController.getUserEnvelopes.execute(req, res));
adminRouter.get('/users/:userId/summary', auth, (req: any, res: any) => adminController.getUserSummary.execute(req, res));

// Base Envelopes
adminRouter.get('/base-envelopes', auth, (req: any, res: any) => adminController.getAllBaseEnvelopes.execute(req, res));
adminRouter.post('/base-envelopes', auth, (req: any, res: any) => adminController.createBaseEnvelope.execute(req, res));
adminRouter.patch('/base-envelopes/:id', auth, (req: any, res: any) => adminController.updateBaseEnvelope.execute(req, res));
adminRouter.delete('/base-envelopes/:id', auth, (req: any, res: any) => adminController.deleteBaseEnvelope.execute(req, res));

export { adminRouter };
