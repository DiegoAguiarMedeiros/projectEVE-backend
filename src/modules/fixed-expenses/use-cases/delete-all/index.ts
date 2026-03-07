import { fixedExpenseRepo } from '../../repos/implementation';
import { DeleteAllUseCase } from './DeleteAllUseCase';
import { DeleteAllController } from './DeleteAllController';

const deleteAllUseCase = new DeleteAllUseCase(fixedExpenseRepo);
const deleteAllController = new DeleteAllController(deleteAllUseCase);

export { deleteAllController };
