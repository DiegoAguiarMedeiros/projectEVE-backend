
import { BaseEnvelopeRepo } from "./implementations/BaseEnvelopeRepo";
import { EnvelopeRepo } from "./implementations/EnvelopeRepo";
import { CreditCardRepo } from "./implementations/CreditCardRepo";
import models from "../../../shared/infra/database/sequelize/models";

const envelopeRepo = new EnvelopeRepo(models);
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);
const creditCardRepo = new CreditCardRepo(models);

export { envelopeRepo, baseEnvelopeRepo, creditCardRepo }
