import { UpdateStatusUseCase } from './UpdateStatusUseCase';
import { UpdateStatusController } from './UpdateStatusController';
import { envelopeRepo } from '../../../../budgeting/envelope/repos/implementation';
import { transactionRepo } from '../../repos/implementation';

const updateStatusUseCase = new UpdateStatusUseCase(transactionRepo,envelopeRepo);
const updateStatusController = new UpdateStatusController(updateStatusUseCase);

export { updateStatusController }