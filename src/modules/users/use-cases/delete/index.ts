
import { DeleteUserController } from "./DeleteUserController";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { userRepo } from "../../repos";

const deleteUserUseCase = new DeleteUserUseCase(userRepo);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export {
    deleteUserUseCase,
    deleteUserController
}
