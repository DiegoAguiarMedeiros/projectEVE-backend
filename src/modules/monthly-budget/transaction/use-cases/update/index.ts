
import { envelopeRepo } from '../../../../budgeting/envelope/repos/implementation';
import { transactionRepo } from '../../repos/implementation';
import { UpdateController } from './UpdateController';
import { UpdateUseCase } from './UpdateUseCase';

const updateUseCase = new UpdateUseCase(transactionRepo,envelopeRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }