
import { debtRepo } from "../../../../debt/repos/implementation";
import { envelopeRepo } from "../../../../budgeting/envelope/repos/implementation";
import { monthlyEnvelopeRepo } from "../../repos/implementation";
import { transactionRepo } from "../../../transaction/repos/implementation";
import { CreateUseCase } from "../create/CreateUseCase";
import { CreateUseCase as CreateTransactionUseCase } from "../../../transaction/use-cases/create/CreateUseCase";
import { Create } from "./Create";

const createTransactionUseCase = new CreateTransactionUseCase(transactionRepo);
const createUseCase = new CreateUseCase(monthlyEnvelopeRepo,createTransactionUseCase);
const create = new Create(
  debtRepo, envelopeRepo, monthlyEnvelopeRepo, createUseCase
)

export { create };