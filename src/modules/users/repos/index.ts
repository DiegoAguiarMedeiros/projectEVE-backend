
import { SequelizeUserRepo } from "./implementations/sequelizeUserRepo";
import models from "../../../shared/infra/database/mongoDB/models";

const userRepo = new SequelizeUserRepo(models);

export { userRepo }
