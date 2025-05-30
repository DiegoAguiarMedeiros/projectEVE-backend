import models from "../../../../../shared/infrastructure/database/sequelize/models";
import { Repository as BaseEnvelopeRepo } from './Repository';
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);
export { baseEnvelopeRepo };