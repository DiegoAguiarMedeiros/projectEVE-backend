import { transactionRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController'
import { DeleteUseCase } from "./DeleteUseCase";

const deleteUseCase = new DeleteUseCase(transactionRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }