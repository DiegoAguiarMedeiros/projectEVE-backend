import { createController } from "./create";
import { getByIdController } from "./getById";
import { loginController } from "./login";

const userController = {
    create:createController,
    get:getByIdController,
    login:loginController,
}

export default userController;