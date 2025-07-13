
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { debtRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(debtRepo,envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}