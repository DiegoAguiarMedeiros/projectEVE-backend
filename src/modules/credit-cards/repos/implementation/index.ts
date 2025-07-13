import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Repository as CreditCardRepo } from './Repository';

const creditCardRepo = new CreditCardRepo(models);

export { creditCardRepo };