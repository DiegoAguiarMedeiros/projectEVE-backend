import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Repository as IncomeRepo } from './Repository';

const incomeRepo = new IncomeRepo(models);

export { incomeRepo };