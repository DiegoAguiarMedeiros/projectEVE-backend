
import { DeleteUserController } from "./DeleteUserController";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { userRepo } from "../../repos";
import { authService } from "../../../../shared/infrastructure/services";

const deleteUserUseCase = new DeleteUserUseCase(userRepo, authService);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export {
    deleteUserUseCase,
    deleteUserController
}
