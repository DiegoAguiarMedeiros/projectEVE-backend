
import { UserRepo } from "./implementations/userRepo";
import models from "../../../shared/infra/database/sequelize/models";

const userRepo = new UserRepo(models);

export { userRepo }
