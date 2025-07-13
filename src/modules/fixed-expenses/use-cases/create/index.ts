import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { fixedExpenseRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(fixedExpenseRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }