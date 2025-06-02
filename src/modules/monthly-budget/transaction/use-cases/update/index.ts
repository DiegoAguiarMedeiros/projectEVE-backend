
import { transactionRepo } from '../../repos/implementation';
import { UpdateController } from './UpdateController';
import { UpdateUseCase } from './UpdateUseCase';

const updateUseCase = new UpdateUseCase(transactionRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }