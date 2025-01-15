
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { investmentsRepo,envelopeRepo } from "../../../repos";
const createdInvestmensUseCase = new CreateUseCase(investmentsRepo,envelopeRepo);
const createdInvestmensController = new CreateController(
    createdInvestmensUseCase
)

export {
    createdInvestmensUseCase,
    createdInvestmensController
}