import { DeleteController } from './DeleteController'
import { DeleteUseCase } from '../../../../../application/useCases/transaction/delete/DeleteUseCase';
import { transactionRepo } from '../../../../../domain/repositories';

const deleteUseCase = new DeleteUseCase(transactionRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }