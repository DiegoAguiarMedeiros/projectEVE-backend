
import { debtRepo } from "../../../debts/repos/implementation";
import { transactionRepo } from "../../repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { CreateUseCase as CreateTransactionUseCase } from "../../use-cases/create/CreateUseCase";
import { Create } from "./Create";
import { deleteAllByDebtId } from "../delete-all-by-debt-id";

const createUseCase = new CreateTransactionUseCase(transactionRepo, envelopeRepo);
const create = new Create(debtRepo, createUseCase, envelopeRepo, deleteAllByDebtId);

export { create };