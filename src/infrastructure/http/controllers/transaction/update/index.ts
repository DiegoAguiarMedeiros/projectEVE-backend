import { UpdateUseCase } from '../../../../../application/useCases/transaction/update/UpdateUseCase';
import { envelopeRepo, transactionRepo } from '../../../../../domain/repositories';
import { UpdateController } from './UpdateController';

const updateUseCase = new UpdateUseCase(transactionRepo,envelopeRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }