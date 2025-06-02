import { CreateController } from "./CreateController";
import { CreateUseCase } from "./CreateUseCase";
import { userRepo } from "../../repos/implementation";


const createUseCase = new CreateUseCase(userRepo);
const createController = new CreateController(
  createUseCase
)

export {
  createController
}