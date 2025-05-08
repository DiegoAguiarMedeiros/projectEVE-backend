
import { CreateUseCase } from "../../../../../application/useCases/transaction/create/CreateUseCase";
import { envelopeRepo, transactionRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(transactionRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }