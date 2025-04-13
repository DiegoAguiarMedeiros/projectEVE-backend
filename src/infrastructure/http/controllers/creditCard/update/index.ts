import { UpdateUseCase } from '../../../../../application/useCases/creditCard/update/UpdateUseCase';
import { creditCardRepo } from '../../../../../domain/repositories';
import { UpdateController } from './UpdateController'

const updateUseCase = new UpdateUseCase(creditCardRepo);
const updateController = new UpdateController(updateUseCase);

export { updateController }