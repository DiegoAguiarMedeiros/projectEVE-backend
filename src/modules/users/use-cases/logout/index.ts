import { LogoutUseCase } from "./LogoutUseCase";
import { authService } from "../../../../shared/infrastructure/services";
import { LogoutController } from "./LogoutController";

const logoutUseCase = new LogoutUseCase(authService);
const logoutController = new LogoutController(logoutUseCase);

export { logoutController };
