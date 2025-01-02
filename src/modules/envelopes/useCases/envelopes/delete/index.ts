import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { envelopeRepo } from "../../../repos";
const deleteEnvelopeUseCase = new DeleteUseCase(envelopeRepo);
const deleteEnvelopeController = new DeleteController(deleteEnvelopeUseCase);

export { deleteEnvelopeController }