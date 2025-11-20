
import { processedIncomesRepo } from "../../../processed-incomes/repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { goalsRepo } from "../../../goals/repos/implementation";
import { fixedExpenseRepo } from "../../../fixed-expenses/repos/implementation";
import { transactionRepo } from "../../repos/implementation";
import { CreateUseCase as CreateTransactionUseCase } from "../create/CreateUseCase";
import { deleteAll } from "../delete-all-by-processed-incomes-id";
import { Create } from "./Create";

const createUseCase = new CreateTransactionUseCase(transactionRepo, envelopeRepo);
const create = new Create(processedIncomesRepo, createUseCase, envelopeRepo, fixedExpenseRepo, goalsRepo, deleteAll)

export { create };