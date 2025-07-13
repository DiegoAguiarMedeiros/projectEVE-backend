import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Repository as TransactionRepo } from './Repository';

const transactionRepo = new TransactionRepo(models);

export { transactionRepo };