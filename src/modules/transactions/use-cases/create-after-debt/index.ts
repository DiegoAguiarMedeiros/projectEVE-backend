
import { debtRepo } from "../../../debts/repos/implementation";
import { transactionRepo } from "../../../transactions/repos/implementation";
import { CreateUseCase } from "../create/CreateUseCase";
import { CreateUseCase as CreateTransactionUseCase } from "../../use-cases/create/CreateUseCase";
import { Create } from "./Create";

const createUseCase = new CreateTransactionUseCase(transactionRepo);
const create = new Create(debtRepo, createUseCase)

export { create };