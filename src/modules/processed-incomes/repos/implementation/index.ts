import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Repository as ProcessedIncomesRepo } from './Repository';

const processedIncomesRepo = new ProcessedIncomesRepo(models);

export { processedIncomesRepo };