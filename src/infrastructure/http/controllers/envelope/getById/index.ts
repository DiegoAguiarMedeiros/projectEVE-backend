import { GetByIdUseCase } from '../../../../../application/useCases/envelope/getById/GetByIdUseCase';
import { envelopeRepo } from '../../../../../domain/repositories';
import { GetByIdController } from './GetByIdController';

const getByIdUseCase = new GetByIdUseCase(envelopeRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }