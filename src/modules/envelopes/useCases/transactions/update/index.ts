import { UpdateController } from './UpdateController'
import { UpdateUseCase } from './UpdateUseCase'
import { transactionRepo } from "../../../repos";
const updatedTransactionUseCase = new UpdateUseCase(transactionRepo);
const updatedTransactionController = new UpdateController(updatedTransactionUseCase);

export { updatedTransactionController }