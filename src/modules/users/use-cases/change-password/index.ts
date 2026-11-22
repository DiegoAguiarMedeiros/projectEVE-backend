
import { ChangePasswordController } from "./ChangePasswordController";
import { ChangePasswordUseCase } from "./ChangePasswordUseCase";
import { userRepo } from "../../repos";
import { authService } from "../../../../shared/infrastructure/services";

const changePasswordUseCase = new ChangePasswordUseCase(userRepo, authService);
const changePasswordController = new ChangePasswordController(changePasswordUseCase);

export {
    changePasswordUseCase,
    changePasswordController
}
