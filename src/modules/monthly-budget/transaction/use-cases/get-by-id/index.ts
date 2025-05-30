import { transactionRepo } from '../../repos/implementation';
import { GetByIdController } from './GetByIdController';
import { GetByIdUseCase } from './GetByIdUseCase';


const getByIdUseCase = new GetByIdUseCase(transactionRepo);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController }