
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { debtRepo } from "../../../repos";

const createDebtUseCase = new CreateUseCase(debtRepo);
const createDebtController = new CreateController(
    createDebtUseCase
)

export {
    createDebtUseCase,
    createDebtController
}