
import { UpdateUseCase } from "./UpdateUseCase";
import { UpdateController } from "./UpdateController";
import { debtRepo } from "../../repos/implementation";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";


const updatedUseCase = new UpdateUseCase(debtRepo, DomainEvents);
const updateController = new UpdateController(updatedUseCase);

export { updateController }