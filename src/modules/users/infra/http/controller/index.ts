import { createController } from "../../../use-cases/create";
import { getByIdController } from "../../../use-cases/get-by-id";
import { loginController } from "../../../use-cases/login";
import { logoutController } from "../../../use-cases/logout";
import { completeRegistrationController } from "../../../use-cases/complete-registration";

const userController = {
    create: createController,
    get: getByIdController,
    login: loginController,
    logout: logoutController,
    completeRegistration: completeRegistrationController
}

export default userController;