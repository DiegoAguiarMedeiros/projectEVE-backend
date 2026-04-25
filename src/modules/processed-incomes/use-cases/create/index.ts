import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { processedIncomesRepo } from "../../repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";

const createUseCase = new CreateUseCase(processedIncomesRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }