
import { LoginUserUseCase } from "../../../../../application/useCases/user/login/LoginUseCase";
import { userRepo } from "../../../../../domain/repositories";
import { authService } from "../../../../services";
import { LoginController } from "./LoginController";

const loginUseCase = new LoginUserUseCase(userRepo, authService);
const loginController = new LoginController(loginUseCase);

export { loginController }