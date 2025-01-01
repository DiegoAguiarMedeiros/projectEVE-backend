import { GetEnvelopeByIdController } from './GetEnvelopeByIdController'
import { GetEnvelopeByIdUseCase } from './GetEnvelopeByIdUseCase'
import { envelopeRepo } from "../../repos";

const getEnvelopeByIdUseCase = new GetEnvelopeByIdUseCase(envelopeRepo);
const getEnvelopeByIdController = new GetEnvelopeByIdController(getEnvelopeByIdUseCase);

export { getEnvelopeByIdController }