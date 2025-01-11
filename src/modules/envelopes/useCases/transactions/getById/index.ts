import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase'
import { transactionRepo } from "../../../repos";

const getTransactionByIdUseCase = new GetByIdUseCase(transactionRepo);
const getTransactionByIdController = new GetByIdController(getTransactionByIdUseCase);

export { getTransactionByIdController }