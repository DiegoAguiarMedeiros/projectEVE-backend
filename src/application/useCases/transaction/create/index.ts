
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "../../../../infrastructure/http/controllers/transaction/create/CreateController";
import { envelopeRepo, transactionRepo } from "../../../../domain/repositories";
import { GetByIdUseCase } from "../../envelope/getById/GetByIdUseCase";

const getEnvelopeByIdUseCase = new GetByIdUseCase(envelopeRepo)
const createTransactionUseCase = new CreateUseCase(transactionRepo,getEnvelopeByIdUseCase);
const createTransactionController = new CreateController(
    createTransactionUseCase
)

export {
    createTransactionUseCase,
    createTransactionController
}