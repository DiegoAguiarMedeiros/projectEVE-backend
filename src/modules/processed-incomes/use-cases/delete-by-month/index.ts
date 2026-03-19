import { processedIncomesRepo } from "../../repos/implementation";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { DeleteByMonthUseCase } from "./DeleteByMonthUseCase";
import { DeleteByMonthController } from "./DeleteByMonthController";

const deleteByMonthUseCase = new DeleteByMonthUseCase(processedIncomesRepo, DomainEvents);
const deleteByMonthController = new DeleteByMonthController(deleteByMonthUseCase);

export { deleteByMonthController };
