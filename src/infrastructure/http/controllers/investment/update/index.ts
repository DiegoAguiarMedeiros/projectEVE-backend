import { UpdateUseCase } from '../../../../../application/useCases/investment/update/UpdateUseCase';
import { investmentRepo } from '../../../../../domain/repositories';
import { UpdateController } from './UpdateController';

const updatedUseCase = new UpdateUseCase(investmentRepo);
const updateController = new UpdateController(updatedUseCase);

export { updateController }