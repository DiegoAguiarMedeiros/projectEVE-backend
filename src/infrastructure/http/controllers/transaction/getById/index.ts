import { GetByIdController } from './GetByIdController';
import { GetByIdUseCase } from '../../../../../application/useCases/transaction/getById/GetByIdUseCase';
import { transactionRepo } from '../../../../../domain/repositories';

const getByIdUseCase = new GetByIdUseCase(transactionRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }