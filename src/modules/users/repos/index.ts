
import { SequelizeUserRepo } from "./implementations/sequelizeUserRepo";
import models from "../../../shared/infra/database/sequilize/models";

const userRepo = new SequelizeUserRepo(models);

export { userRepo }
