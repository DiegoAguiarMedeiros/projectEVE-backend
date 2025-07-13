import { incomeRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController'
import { DeleteUseCase } from "./DeleteUseCase";

const deleteUseCase = new DeleteUseCase(incomeRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }