
import { GetMeUserUseCase } from "./GetMeUseCase";
import { GetMeController } from "./GetMeController";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const getMeUseCase = new GetMeUserUseCase(userRepo, authService);
const getMeController = new GetMeController(getMeUseCase);

export { getMeController, getMeUseCase }