import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { creditCardRepo } from "../../repos/implementation";

const createUseCase = new CreateUseCase(creditCardRepo);
const createController = new CreateController(
    createUseCase
)

export {
    createController
}