import { goalsRepo } from '../../repos/implementation';
import { DeleteAllUseCase } from './DeleteAllUseCase';
import { DeleteAllController } from './DeleteAllController';

const deleteAllUseCase = new DeleteAllUseCase(goalsRepo);
const deleteAllController = new DeleteAllController(deleteAllUseCase);

export { deleteAllController };
