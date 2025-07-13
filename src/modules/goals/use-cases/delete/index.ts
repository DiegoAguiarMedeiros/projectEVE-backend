import { goalsRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController';
import { DeleteUseCase } from './DeleteUseCase';

const deleteUseCase = new DeleteUseCase(goalsRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }