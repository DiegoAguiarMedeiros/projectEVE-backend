
import { ChangePasswordController } from "./ChangePasswordController";
import { ChangePasswordUseCase } from "./ChangePasswordUseCase";
import { userRepo } from "../../repos";

const changePasswordUseCase = new ChangePasswordUseCase(userRepo);
const changePasswordController = new ChangePasswordController(changePasswordUseCase);

export {
    changePasswordUseCase,
    changePasswordController
}
