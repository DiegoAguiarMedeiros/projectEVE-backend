import { transactionRepo } from '../../repos/implementation';
import { envelopeRepo } from '../../../envelopes/repos/implementation';
import { DeleteController } from './DeleteController'
import { DeleteUseCase } from "./DeleteUseCase";

const deleteUseCase = new DeleteUseCase(transactionRepo, envelopeRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }