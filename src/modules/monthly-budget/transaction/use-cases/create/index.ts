
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { envelopeRepo } from "../../../../budgeting/envelope/repos/implementation";
import { transactionRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(transactionRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }