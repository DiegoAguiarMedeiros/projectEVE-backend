
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';
import { processedIncomesRepo } from '../../repos/implementation';
import { envelopeRepo } from '../../../envelopes/repos/implementation';
import { UpdateController } from './UpdateController';
import { UpdateUseCase } from './UpdateUseCase';

const updateUseCase = new UpdateUseCase(processedIncomesRepo, envelopeRepo, DomainEvents);
const updateController = new UpdateController(updateUseCase);

export { updateController }