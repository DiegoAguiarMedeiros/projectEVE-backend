
import { MongoEnvelopeRepo } from "./implementations/mongoEnvelopeRepo";
import models from "../../../shared/infra/database/sequelize/models";

const envelopeRepo = new MongoEnvelopeRepo(models);

export { envelopeRepo }
