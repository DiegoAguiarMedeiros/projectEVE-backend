import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { transactionRepo } from "../../../repos";
const deleteTransactionUseCase = new DeleteUseCase(transactionRepo);
const deleteTransactionController = new DeleteController(deleteTransactionUseCase);

export { deleteTransactionController }