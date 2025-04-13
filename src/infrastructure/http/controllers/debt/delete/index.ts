import { DeleteUseCase } from '../../../../../application/useCases/debt/delete/DeleteUseCase';
import { debtRepo } from '../../../../../domain/repositories';
import { DeleteController } from './DeleteController'

const deleteUseCase = new DeleteUseCase(debtRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }