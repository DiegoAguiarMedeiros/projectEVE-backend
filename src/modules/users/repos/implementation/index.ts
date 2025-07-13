import models from '../../../../shared/infrastructure/database/sequelize/models';
import { Repository as UserRepo } from './Repository';

const userRepo = new UserRepo(models);

export { userRepo };