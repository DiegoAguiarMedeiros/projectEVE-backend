import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { goalsRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(goalsRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }