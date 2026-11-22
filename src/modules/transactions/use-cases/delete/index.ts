import { transactionRepo } from '../../repos/implementation';
import { envelopeRepo } from '../../../envelopes/repos/implementation';
import { debtRepo } from '../../../debts/repos/implementation';
import { DeleteController } from './DeleteController'
import { DeleteUseCase } from "./DeleteUseCase";

const deleteUseCase = new DeleteUseCase(transactionRepo, envelopeRepo, debtRepo);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController, deleteUseCase }