
import { CreateUseCase } from "../../../../../application/useCases/debt/create/CreateUseCase";
import { debtRepo, envelopeRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(debtRepo,envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}