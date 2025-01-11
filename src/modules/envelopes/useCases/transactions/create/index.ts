
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { transactionRepo } from "../../../repos";
import { getEnvelopeByIdUseCase } from "../../envelopes/getById";

const createTransactionUseCase = new CreateUseCase(transactionRepo,getEnvelopeByIdUseCase);
const createTransactionController = new CreateController(
    createTransactionUseCase
)

export {
    createTransactionUseCase,
    createTransactionController
}