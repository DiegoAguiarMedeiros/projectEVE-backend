import { GetByIdUseCase } from './GetByIdUseCase';
import { GetByIdController } from './GetByIdController';
import { fixedExpenseRepo } from '../../repos/implementation';

const getByIdUseCase = new GetByIdUseCase(fixedExpenseRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }