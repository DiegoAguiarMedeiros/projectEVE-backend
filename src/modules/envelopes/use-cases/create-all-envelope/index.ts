
import { userRepo } from "../../../users/repos/implementation";
import { baseEnvelopeRepo } from "../../../base-envelope/repos/implementation";
import { envelopeRepo } from "../../repos/implementation";
import { CreateUseCase } from "../create/CreateUseCase";
import { Create } from "./Create";

const createUseCase = new CreateUseCase(envelopeRepo);
const create = new Create(
  userRepo, baseEnvelopeRepo, createUseCase
)

export { create };