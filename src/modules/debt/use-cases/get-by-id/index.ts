
import { debtRepo } from '../../repos/implementation';
import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase';

const getByIdUseCase = new GetByIdUseCase(debtRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }