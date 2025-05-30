import models from '../../../../../shared/infrastructure/database/sequelize/models';
import { Repository as EnvelopeRepo } from './Repository';

const envelopeRepo = new EnvelopeRepo(models);

export { envelopeRepo };