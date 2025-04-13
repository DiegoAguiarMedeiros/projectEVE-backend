import { DeleteUseCase } from '../../../../../application/useCases/creditCard/delete/DeleteUseCase';
import { creditCardRepo } from '../../../../../domain/repositories';
import { DeleteController } from './DeleteController';

const deleteUseCase = new DeleteUseCase(creditCardRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }