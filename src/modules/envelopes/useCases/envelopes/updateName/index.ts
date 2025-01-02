import { UpdateNameController } from './UpdateNameController'
import { UpdateNameUseCase } from './UpdateNameUseCase'
import { envelopeRepo } from "../../../repos";
const updateEnvelopeNameUseCase = new UpdateNameUseCase(envelopeRepo);
const updateEnvelopeNameController = new UpdateNameController(updateEnvelopeNameUseCase);

export { updateEnvelopeNameController }