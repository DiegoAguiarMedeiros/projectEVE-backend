import { DeleteUseCase } from '../../../../../application/useCases/envelope/delete/DeleteUseCase';
import { envelopeRepo } from '../../../../../domain/repositories';
import { DeleteController } from './DeleteController';

const deleteUseCase = new DeleteUseCase(envelopeRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }