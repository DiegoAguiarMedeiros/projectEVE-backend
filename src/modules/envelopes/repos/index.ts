
import { MongoEnvelopeRepo } from "./implementations/mongoEnvelopeRepo";
import models from "../../../shared/infra/database/mongoDB/models";

const envelopeRepo = new MongoEnvelopeRepo(models);

export { envelopeRepo }
