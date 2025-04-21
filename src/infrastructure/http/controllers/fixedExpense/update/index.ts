import { UpdateUseCase } from '../../../../../application/useCases/fixedExpense/update/UpdateUseCase';
import { fixedExpenseRepo } from '../../../../../domain/repositories';
import { UpdateController } from './UpdateController';

const updatedUseCase = new UpdateUseCase(fixedExpenseRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }