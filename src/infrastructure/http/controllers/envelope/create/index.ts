import { CreateUseCase } from "../../../../../application/useCases/envelope/create/CreateUseCase";
import { envelopeRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}