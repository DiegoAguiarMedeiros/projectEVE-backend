import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { incomeRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(incomeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }