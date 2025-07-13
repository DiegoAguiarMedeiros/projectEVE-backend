
import { envelopeRepo } from '../../repos/implementation';
import { GetByIdController } from './GetByIdController';
import { GetByIdUseCase } from './GetByIdUseCase';

const getByIdUseCase = new GetByIdUseCase(envelopeRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }