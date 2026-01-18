
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { transactionRepo } from "../../repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";

const createUseCase = new CreateUseCase(transactionRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController, createUseCase }