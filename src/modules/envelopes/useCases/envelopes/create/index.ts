
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { envelopeRepo } from "../../../repos";

const createEnvelopeUseCase = new CreateUseCase(envelopeRepo);
const createEnvelopeController = new CreateController(
    createEnvelopeUseCase
)

export {
    createEnvelopeUseCase,
    createEnvelopeController
}