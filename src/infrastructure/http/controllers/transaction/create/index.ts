
import { GetByIdUseCase } from "../../../../../application/useCases/envelope/getById/GetByIdUseCase";
import { CreateUseCase } from "../../../../../application/useCases/transaction/create/CreateUseCase";
import { envelopeRepo, transactionRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const getEnvelopepeByIdUseCase = new GetByIdUseCase(envelopeRepo);

const createUseCase = new CreateUseCase(transactionRepo, getEnvelopepeByIdUseCase);
const createController = new CreateController(
    createUseCase
)

export { createController }