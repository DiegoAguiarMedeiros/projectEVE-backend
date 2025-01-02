
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";
import { userRepo } from "../../repos";
import { envelopeRepo, baseEnvelopeRepo } from "../../../envelopes/repos";
import { CreateEnvelopeUseCase } from "../../../envelopes/useCases/envelopes/createEnvelope/CreateEnvelopeUseCase";

const createUserUseCase = new CreateUserUseCase(userRepo, baseEnvelopeRepo, new CreateEnvelopeUseCase(envelopeRepo));
const createUserController = new CreateUserController(
  createUserUseCase
)

export {
  createUserUseCase,
  createUserController
}