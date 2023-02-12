
import { MongoUserRepo } from "./implementations/mongoUserRepo";
import models from "../../../shared/infra/database/mongoDB/models";

const userRepo = new MongoUserRepo(models);

export { userRepo }
