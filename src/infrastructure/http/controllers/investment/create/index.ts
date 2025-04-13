import { CreateUseCase } from "../../../../../application/useCases/investment/create/CreateUseCase";
import { investmentRepo, envelopeRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(investmentRepo, envelopeRepo);
const createController = new CreateController(
    createUseCase
)

export { createController }