import { GetByIdUseCase } from '../../../../../application/useCases/fixedExpense/getById/GetByIdUseCase';
import { fixedExpenseRepo } from '../../../../../domain/repositories';
import { GetByIdController } from './GetByIdController';

const getByIdUseCase = new GetByIdUseCase(fixedExpenseRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }