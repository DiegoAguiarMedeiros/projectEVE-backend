
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';
import { transactionRepo } from '../../repos/implementation';
import { UpdateController } from './UpdateController';
import { UpdateUseCase } from './UpdateUseCase';

const updateUseCase = new UpdateUseCase(transactionRepo,DomainEvents);
const updateController = new UpdateController(updateUseCase);

export { updateController }