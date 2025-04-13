
import { CreateUseCase } from "../../../../../application/useCases/creditCard/create/CreateUseCase";
import { creditCardRepo } from "../../../../../domain/repositories";
import { CreateController } from "./CreateController";

const createUseCase = new CreateUseCase(creditCardRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}