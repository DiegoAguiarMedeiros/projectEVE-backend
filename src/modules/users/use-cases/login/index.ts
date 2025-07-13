
import { LoginUserUseCase } from "./LoginUseCase";
import { authService } from "../../../../shared/infrastructure/services";
import { LoginController } from "./LoginController";
import { userRepo } from "../../repos/implementation";

const loginUseCase = new LoginUserUseCase(userRepo, authService);
const loginController = new LoginController(loginUseCase);

export { loginController }