import { createController } from "../../../use-cases/create";
import { getByIdController } from "../../../use-cases/get-by-id";
import { loginController } from "../../../use-cases/login";
import { logoutController } from "../../../use-cases/logout";
import { completeRegistrationController } from "../../../use-cases/complete-registration";
import { updateUserController } from "../../../use-cases/update";
import { changePasswordController } from "../../../use-cases/change-password";

const userController = {
    create: createController,
    get: getByIdController,
    login: loginController,
    logout: logoutController,
    completeRegistration: completeRegistrationController,
    update: updateUserController,
    changePassword: changePasswordController
}

export default userController;