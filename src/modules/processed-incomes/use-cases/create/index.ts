import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { processedIncomesRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(processedIncomesRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }