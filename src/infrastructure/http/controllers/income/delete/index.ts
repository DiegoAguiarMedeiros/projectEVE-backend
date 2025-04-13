import { DeleteController } from './DeleteController'
import { DeleteUseCase } from '../../../../../application/useCases/income/delete/DeleteUseCase';
import { incomeRepo } from '../../../../../domain/repositories';

const deleteUseCase = new DeleteUseCase(incomeRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }