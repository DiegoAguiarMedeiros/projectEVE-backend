import { processedIncomesRepo } from "../../repos/implementation";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteController } from "./DeleteController";

const deleteUseCase = new DeleteUseCase(processedIncomesRepo, DomainEvents);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController };
