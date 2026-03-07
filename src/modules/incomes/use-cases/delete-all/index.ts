import { incomeRepo } from '../../repos/implementation';
import { DeleteAllController } from './DeleteAllController';
import { DeleteAllUseCase } from './DeleteAllUseCase';
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents';

const deleteAllUseCase = new DeleteAllUseCase(incomeRepo, DomainEvents);
const deleteAllController = new DeleteAllController(deleteAllUseCase);

export { deleteAllController };
