
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { investmentsRepo } from "../../../repos";

const createdInvestmensUseCase = new CreateUseCase(investmentsRepo);
const createdInvestmensController = new CreateController(
    createdInvestmensUseCase
)

export {
    createdInvestmensUseCase,
    createdInvestmensController
}