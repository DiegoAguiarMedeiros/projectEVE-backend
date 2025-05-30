import { GetByIdUseCase } from './GetByIdUseCase';
import { GetByIdController } from './GetByIdController';
import { incomeRepo } from '../../repos/implementation';

const getByIdUseCase = new GetByIdUseCase(incomeRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }