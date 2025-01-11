
import { BaseEnvelopeRepo } from "./implementations/BaseEnvelopeRepo";
import { EnvelopeRepo } from "./implementations/EnvelopeRepo";
import { CreditCardRepo } from "./implementations/CreditCardRepo";
import { DebtRepo } from "./implementations/DebtRepo";
import { IncomesRepo } from "./implementations/IncomeRepo";
import { InvestmentsRepo } from "./implementations/InvestmentsRepo";
import { TransactionRepo } from "./implementations/TransactionRepo";
import models from "../../../shared/infra/database/sequelize/models";

models.Debts.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
models.Transactions.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
models.Envelopes.belongsTo(models.Users, { foreignKey: 'user_id' });
models.Envelopes.hasMany(models.Debts, { foreignKey: 'envelope_id' });
models.Users.hasMany(models.Envelopes, { foreignKey: 'user_id' });

const envelopeRepo = new EnvelopeRepo(models);
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);
const creditCardRepo = new CreditCardRepo(models);
const investmentsRepo = new InvestmentsRepo(models);
const debtRepo = new DebtRepo(models);
const incomesRepo = new IncomesRepo(models);
const transactionRepo = new TransactionRepo(models);



export { envelopeRepo, baseEnvelopeRepo, creditCardRepo, debtRepo, investmentsRepo, incomesRepo ,transactionRepo}
