
import { creditCardRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController';
import { DeleteUseCase } from './DeleteUseCase';

const deleteUseCase = new DeleteUseCase(creditCardRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }