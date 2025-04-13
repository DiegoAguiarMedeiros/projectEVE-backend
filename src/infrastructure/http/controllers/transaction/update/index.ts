import { UpdateUseCase } from '../../../../../application/useCases/transaction/update/UpdateUseCase';
import { transactionRepo } from '../../../../../domain/repositories';
import { UpdateController } from './UpdateController';

const updateUseCase = new UpdateUseCase(transactionRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }