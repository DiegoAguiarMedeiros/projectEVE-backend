import { CreateController } from "./CreateController";
import { CreateUseCase } from "../../../../../application/useCases/user/create/CreateUseCase";
import { CreateUseCase as CreateEnvelopeUseCase } from "../../../../../application/useCases/envelope/create/CreateUseCase";
import { baseEnvelopeRepo, envelopeRepo, userRepo } from "../../../../../domain/repositories";

const createUseCase = new CreateUseCase(userRepo, baseEnvelopeRepo, new CreateEnvelopeUseCase(envelopeRepo));
const createController = new CreateController(
  createUseCase
)

export {
  createController
}