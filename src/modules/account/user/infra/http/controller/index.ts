import { createController } from "../../../use-cases/create";
import { getByIdController } from "../../../use-cases/get-by-id";
import { loginController } from "../../../use-cases/login";

const userController = {
    create:createController,
    get:getByIdController,
    login:loginController,
}

export default userController;