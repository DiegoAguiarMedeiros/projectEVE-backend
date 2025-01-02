import { DeleteEnvelopeController } from './DeleteEnvelopeController'
import { DeleteEnvelopeUseCase } from './DeleteEnvelopeUseCase'
import { envelopeRepo } from "../../../repos";
const deleteEnvelopeUseCase = new DeleteEnvelopeUseCase(envelopeRepo);
const deleteEnvelopeController = new DeleteEnvelopeController(deleteEnvelopeUseCase);

export { deleteEnvelopeController }