import models from "../../../../../shared/infrastructure/database/sequelize/models";
import { Repository as FixedExpenseRepo } from './Repository';

const fixedExpenseRepo = new FixedExpenseRepo(models);

export { fixedExpenseRepo };