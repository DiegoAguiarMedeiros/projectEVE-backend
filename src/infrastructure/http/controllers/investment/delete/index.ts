import { DeleteController } from './DeleteController'
import { DeleteUseCase } from '../../../../../application/useCases/investment/delete/DeleteUseCase'
import { investmentRepo } from '../../../../../domain/repositories';

const deleteUseCase = new DeleteUseCase(investmentRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }