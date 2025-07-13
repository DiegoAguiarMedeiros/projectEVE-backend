import { fixedExpenseRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController';
import { DeleteUseCase } from './DeleteUseCase';

const deleteUseCase = new DeleteUseCase(fixedExpenseRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }