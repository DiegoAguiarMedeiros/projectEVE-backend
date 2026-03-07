import { transactionRepo } from '../../repos/implementation';
import { envelopeRepo } from '../../../envelopes/repos/implementation';
import { DeleteUseCase } from '../delete/DeleteUseCase';
import { DeleteAllByEnvelopeUseCase } from './DeleteAllByEnvelopeUseCase';
import { DeleteAllByEnvelopeController } from './DeleteAllByEnvelopeController';

const deleteUseCase = new DeleteUseCase(transactionRepo, envelopeRepo);
const deleteAllByEnvelopeUseCase = new DeleteAllByEnvelopeUseCase(transactionRepo, deleteUseCase);
const deleteAllByEnvelopeController = new DeleteAllByEnvelopeController(deleteAllByEnvelopeUseCase);

export { deleteAllByEnvelopeController };
