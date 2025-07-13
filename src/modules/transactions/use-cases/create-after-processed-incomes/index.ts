
import { processedIncomesRepo } from "../../../processed-incomes/repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { transactionRepo } from "../../repos/implementation";
import { CreateUseCase as CreateTransactionUseCase } from "../create/CreateUseCase";
import { Create } from "./Create";

const createUseCase = new CreateTransactionUseCase(transactionRepo);
const create = new Create(processedIncomesRepo, createUseCase,envelopeRepo)

export { create };