
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { userRepo } from "../../repos";
import { envelopeRepo, baseEnvelopeRepo } from "../../../envelopes/repos";
import { CreateUseCase as CreateEnvelopeUseCase } from "../../../envelopes/useCases/envelopes/create/CreateUseCase";

const createUserUseCase = new CreateUseCase(userRepo, baseEnvelopeRepo, new CreateEnvelopeUseCase(envelopeRepo));
const createUserController = new CreateController(
  createUserUseCase
)

export {
  createUserUseCase,
  createUserController
}