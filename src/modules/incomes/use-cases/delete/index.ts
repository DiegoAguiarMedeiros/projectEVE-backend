import { incomeRepo } from '../../repos/implementation';
import { DeleteController } from './DeleteController'
import { DeleteUseCase } from "./DeleteUseCase";

import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
const deleteUseCase = new DeleteUseCase(incomeRepo, DomainEvents);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }