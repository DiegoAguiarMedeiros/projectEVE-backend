import { UpdateUseCase } from '../../../../../application/useCases/income/update/UpdateUseCase';
import { incomeRepo } from '../../../../../domain/repositories';
import { UpdateController } from './UpdateController';

const updatedUseCase = new UpdateUseCase(incomeRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }