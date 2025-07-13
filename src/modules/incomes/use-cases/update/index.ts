import { UpdateUseCase } from './UpdateUseCase';
import { UpdateController } from './UpdateController';
import { incomeRepo } from '../../repos/implementation';

const updatedUseCase = new UpdateUseCase(incomeRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }