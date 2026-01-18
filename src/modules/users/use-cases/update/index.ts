
import { UpdateUserController } from "./UpdateUserController";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { userRepo } from "../../repos";

const updateUserUseCase = new UpdateUserUseCase(userRepo);
const updateUserController = new UpdateUserController(updateUserUseCase);

export {
    updateUserUseCase,
    updateUserController
}
