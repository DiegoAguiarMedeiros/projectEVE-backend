import { CreateUseCase } from "../../../../../application/useCases/fixedExpense/create/CreateUseCase";
import { fixedExpenseRepo, envelopeRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(fixedExpenseRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }