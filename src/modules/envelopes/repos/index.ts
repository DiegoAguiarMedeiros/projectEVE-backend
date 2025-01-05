
import { BaseEnvelopeRepo } from "./implementations/BaseEnvelopeRepo";
import { EnvelopeRepo } from "./implementations/EnvelopeRepo";
import { CreditCardRepo } from "./implementations/CreditCardRepo";
import { DebtRepo } from "./implementations/DebtRepo";
import { InvestmentsRepo } from "./implementations/InvestmentsRepo";
import models from "../../../shared/infra/database/sequelize/models";

const envelopeRepo = new EnvelopeRepo(models);
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);
const creditCardRepo = new CreditCardRepo(models);
const investmentsRepo = new InvestmentsRepo(models);
const debtRepo = new DebtRepo(models);

export { envelopeRepo, baseEnvelopeRepo, creditCardRepo, debtRepo, investmentsRepo }
