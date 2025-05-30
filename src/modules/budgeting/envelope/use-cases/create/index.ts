import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { envelopeRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}