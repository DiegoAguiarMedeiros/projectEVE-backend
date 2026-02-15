import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteController } from './DeleteController'
import { debtRepo } from "../../repos/implementation";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";

const deleteUseCase = new DeleteUseCase(debtRepo, DomainEvents);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController }