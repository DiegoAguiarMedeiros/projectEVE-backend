import models from "../../../../../shared/infrastructure/database/sequelize/models";
import { Repository as MonthlyEnvelopeRepo } from './Repository';

const monthlyEnvelopeRepo = new MonthlyEnvelopeRepo(models);

export { monthlyEnvelopeRepo };