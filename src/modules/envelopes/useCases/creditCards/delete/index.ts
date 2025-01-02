import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { creditCardRepo } from "../../../repos";
const deleteEnvelopeUseCase = new DeleteUseCase(creditCardRepo);
const deleteEnvelopeController = new DeleteController(deleteEnvelopeUseCase);

export { deleteEnvelopeController }