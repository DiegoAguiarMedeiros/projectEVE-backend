
import { BaseEnvelopeRepo } from "./implementations/BaseEnvelopeRepo";
import { EnvelopeRepo } from "./implementations/EnvelopeRepo";
import models from "../../../shared/infra/database/sequelize/models";

const envelopeRepo = new EnvelopeRepo(models);
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);

export { envelopeRepo, baseEnvelopeRepo }
