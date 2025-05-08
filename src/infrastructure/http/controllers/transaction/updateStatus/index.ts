import { UpdateStatusUseCase } from '../../../../../application/useCases/transaction/updateStatus/UpdateStatusUseCase';
import { envelopeRepo, transactionRepo } from '../../../../../domain/repositories';
import { UpdateStatusController } from './UpdateStatusController';

const updateStatusUseCase = new UpdateStatusUseCase(transactionRepo,envelopeRepo);
const updateStatusController = new UpdateStatusController(updateStatusUseCase);

export { updateStatusController }