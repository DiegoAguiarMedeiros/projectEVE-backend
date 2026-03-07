import { debtRepo } from '../../repos/implementation';
import { DeleteAllUseCase } from './DeleteAllUseCase';
import { DeleteAllController } from './DeleteAllController';

const deleteAllUseCase = new DeleteAllUseCase(debtRepo);
const deleteAllController = new DeleteAllController(deleteAllUseCase);

export { deleteAllController };
