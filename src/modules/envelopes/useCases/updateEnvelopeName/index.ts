import { UpdateEnvelopeNameController } from './UpdateEnvelopeNameController'
import { UpdateEnvelopeNameUseCase } from './UpdateEnvelopeNameUseCase'
import { envelopeRepo } from "../../repos";
const updateEnvelopeNameUseCase = new UpdateEnvelopeNameUseCase(envelopeRepo);
const updateEnvelopeNameController = new UpdateEnvelopeNameController(updateEnvelopeNameUseCase);

export { updateEnvelopeNameController }