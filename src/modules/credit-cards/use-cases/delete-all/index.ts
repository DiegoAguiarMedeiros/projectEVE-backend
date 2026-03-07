import { creditCardRepo } from '../../repos/implementation';
import { DeleteAllUseCase } from './DeleteAllUseCase';
import { DeleteAllController } from './DeleteAllController';

const deleteAllUseCase = new DeleteAllUseCase(creditCardRepo);
const deleteAllController = new DeleteAllController(deleteAllUseCase);

export { deleteAllController };
