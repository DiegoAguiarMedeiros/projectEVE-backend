import models from "../../../../shared/infrastructure/database/sequelize/models";
import { Repository as GoalsRepo } from './Repository';

const goalsRepo = new GoalsRepo(models);

export { goalsRepo };