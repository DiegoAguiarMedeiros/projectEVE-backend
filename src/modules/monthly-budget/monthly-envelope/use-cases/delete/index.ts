
import { monthlyEnvelopeRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController';
import { DeleteUseCase } from './DeleteUseCase';

const deleteUseCase = new DeleteUseCase(monthlyEnvelopeRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }