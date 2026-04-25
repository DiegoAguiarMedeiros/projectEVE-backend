import { createController } from "../../../use-cases/create";
import { getByIdController } from "../../../use-cases/get-by-id";
import { loginController } from "../../../use-cases/login";
import { logoutController } from "../../../use-cases/logout";
import { completeRegistrationController } from "../../../use-cases/complete-registration";
import { updateUserController } from "../../../use-cases/update";
import { changePasswordController } from "../../../use-cases/change-password";
import { verifyEmailController } from "../../../use-cases/verify-email";
import { deleteUserController } from "../../../use-cases/delete";
import { requestPasswordResetController } from "../../../use-cases/request-password-reset";
import { resetPasswordController } from "../../../use-cases/reset-password";

const userController = {
    create: createController,
    get: getByIdController,
    login: loginController,
    logout: logoutController,
    completeRegistration: completeRegistrationController,
    update: updateUserController,
    changePassword: changePasswordController,
    verifyEmail: verifyEmailController,
    deleteAccount: deleteUserController,
    requestPasswordReset: requestPasswordResetController,
    resetPassword: resetPasswordController,
}

export default userController;