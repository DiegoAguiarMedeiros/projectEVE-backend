import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase'
import { envelopeRepo } from "../../../repos";

const getEnvelopeByIdUseCase = new GetByIdUseCase(envelopeRepo);
const getEnvelopeByIdController = new GetByIdController(getEnvelopeByIdUseCase);

export { getEnvelopeByIdController,getEnvelopeByIdUseCase }