
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { transactionRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(transactionRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }