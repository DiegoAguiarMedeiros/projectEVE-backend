import { CreateUseCase } from "../../../../../application/useCases/income/create/CreateUseCase";
import { incomeRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(incomeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }