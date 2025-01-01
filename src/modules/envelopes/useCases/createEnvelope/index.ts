
import { CreateEnvelopeUseCase } from "./CreateEnvelopeUseCase";
import { CreateEnvelopeController } from "./CreateEnvelopeController";
import { envelopeRepo } from "../../repos";

const createEnvelopeUseCase = new CreateEnvelopeUseCase(envelopeRepo);
const createEnvelopeController = new CreateEnvelopeController(
    createEnvelopeUseCase
)

export {
    createEnvelopeUseCase,
    createEnvelopeController
}