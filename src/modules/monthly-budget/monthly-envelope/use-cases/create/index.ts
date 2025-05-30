
import { monthlyEnvelopeRepo } from "../../repos/implementation";
import { CreateController } from "./CreateController";
import { CreateUseCase } from "./CreateUseCase";

const createUseCase = new CreateUseCase(monthlyEnvelopeRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}