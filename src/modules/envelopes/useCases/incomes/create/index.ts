
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { incomesRepo } from "../../../repos";

const createIncomeUseCase = new CreateUseCase(incomesRepo);
const createIncomeController = new CreateController(
    createIncomeUseCase
)

export {
    createIncomeUseCase,
    createIncomeController
}