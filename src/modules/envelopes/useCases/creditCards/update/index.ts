import { UpdateController } from './UpdateController'
import { UpdateUseCase } from './UpdateUseCase'
import { creditCardRepo } from "../../../repos";
const updateEnvelopeUseCase = new UpdateUseCase(creditCardRepo);
const updateEnvelopeController = new UpdateController(updateEnvelopeUseCase);

export { updateEnvelopeController }