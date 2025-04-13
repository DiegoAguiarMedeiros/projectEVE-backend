import models from "../../infrastructure/database/sequelize/models";
import { Repository as BaseEnvelopeRepo } from "./baseEnvelope/implementation/Repository";
import { Repository as  CreditCardRepo } from "./creditCard/implementation/Repository";
import { Repository as  DebtRepo } from "./debt/implementation/Repository";
import { Repository as  EnvelopeRepo } from "./envelope/implementation/Repository";
import { Repository as  IncomeRepo } from "./income/implementation/Repository";
import { Repository as  InvestmentRepo } from "./investment/implementation/Repository";
import { Repository as  TransactionRepo } from "./transaction/implementation/Repository";
import { Repository as  UserRepo } from "./user/implementation/Repository";


models.Debts.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
models.Transactions.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
models.Investments.belongsTo(models.Envelopes, { foreignKey: 'envelope_id' });
models.Envelopes.belongsTo(models.Users, { foreignKey: 'user_id' });
models.Envelopes.hasMany(models.Debts, { foreignKey: 'envelope_id' });
models.Users.hasMany(models.Envelopes, { foreignKey: 'user_id' });

const envelopeRepo = new EnvelopeRepo(models);
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);
const creditCardRepo = new CreditCardRepo(models);
const investmentRepo = new InvestmentRepo(models);
const debtRepo = new DebtRepo(models);
const incomeRepo = new IncomeRepo(models);
const transactionRepo = new TransactionRepo(models);
const userRepo = new UserRepo(models);



export { userRepo,envelopeRepo, baseEnvelopeRepo, creditCardRepo, debtRepo, investmentRepo, incomeRepo ,transactionRepo}
