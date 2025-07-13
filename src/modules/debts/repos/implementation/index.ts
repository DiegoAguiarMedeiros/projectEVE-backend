import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Repository as DebtRepo } from './Repository';

const debtRepo = new DebtRepo(models);

export { debtRepo };