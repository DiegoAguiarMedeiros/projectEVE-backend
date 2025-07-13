import { GetByIdUseCase } from './GetByIdUseCase';
import { GetByIdController } from './GetByIdController';
import { goalsRepo } from '../../repos/implementation';

const getByIdUseCase = new GetByIdUseCase(goalsRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }