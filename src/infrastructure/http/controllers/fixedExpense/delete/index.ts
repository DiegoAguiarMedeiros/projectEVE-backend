import { DeleteController } from './DeleteController'
import { DeleteUseCase } from '../../../../../application/useCases/fixedExpense/delete/DeleteUseCase'
import { fixedExpenseRepo } from '../../../../../domain/repositories';

const deleteUseCase = new DeleteUseCase(fixedExpenseRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }