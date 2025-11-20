import { UpdateStatusUseCase } from './UpdateStatusUseCase';
import { UpdateStatusController } from './UpdateStatusController';
import { envelopeRepo } from '../../../envelopes/repos/implementation';
import { transactionRepo } from '../../repos/implementation';
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';

const updateStatusUseCase = new UpdateStatusUseCase(transactionRepo,envelopeRepo,DomainEvents);
const updateStatusController = new UpdateStatusController(updateStatusUseCase);

export { updateStatusController }