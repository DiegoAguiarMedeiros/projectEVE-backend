import models from "../../infrastructure/database/sequelize/models";
import { Repository as BaseEnvelopeRepo } from "./baseEnvelope/implementation/Repository";
import { Repository as  CreditCardRepo } from "./creditCard/implementation/Repository";
import { Repository as  DebtRepo } from "./debt/implementation/Repository";
import { Repository as  EnvelopeRepo } from "./envelope/implementation/Repository";
import { Repository as  IncomeRepo } from "./income/implementation/Repository";
import { Repository as  FixedExpenseRepo } from "./fixedExpense/implementation/Repository";
import { Repository as  TransactionRepo } from "./transaction/implementation/Repository";
import { Repository as  UserRepo } from "./user/implementation/Repository";


models.Debt.belongsTo(models.Envelope, { foreignKey: 'envelope_id' });
models.Transaction.belongsTo(models.Envelope, { foreignKey: 'envelope_id' });
models.FixedExpense.belongsTo(models.Envelope, { foreignKey: 'envelope_id' });
models.Envelope.belongsTo(models.User, { foreignKey: 'user_id' });
models.Envelope.hasMany(models.Debt, { foreignKey: 'envelope_id' });
models.User.hasMany(models.Envelope, { foreignKey: 'user_id' });

const envelopeRepo = new EnvelopeRepo(models);
const baseEnvelopeRepo = new BaseEnvelopeRepo(models);
const creditCardRepo = new CreditCardRepo(models);
const fixedExpenseRepo = new FixedExpenseRepo(models);
const debtRepo = new DebtRepo(models);
const incomeRepo = new IncomeRepo(models);
const transactionRepo = new TransactionRepo(models);
const userRepo = new UserRepo(models);



export { userRepo,envelopeRepo, baseEnvelopeRepo, creditCardRepo, debtRepo, fixedExpenseRepo, incomeRepo ,transactionRepo}
