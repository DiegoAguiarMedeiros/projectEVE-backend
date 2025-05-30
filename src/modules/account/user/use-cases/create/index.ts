import { CreateController } from "./CreateController";
import { CreateUseCase } from "./CreateUseCase";
import { CreateUseCase as CreateEnvelopeUseCase } from "../../../../budgeting/envelope/use-cases/create/CreateUseCase";
import { baseEnvelopeRepo } from "../../../../budgeting/base-envelope/repos/implementation";
import { envelopeRepo } from "../../../../budgeting/envelope/repos/implementation";
import { userRepo } from "../../repos/implementation";


const createUseCase = new CreateUseCase(userRepo, baseEnvelopeRepo, new CreateEnvelopeUseCase(envelopeRepo));
const createController = new CreateController(
  createUseCase
)

export {
  createController
}