import { GetByIdUseCase } from "../../../../../application/useCases/user/getById/GetByIdUseCase";
import { userRepo } from "../../../../../domain/repositories";
import { authService } from "../../../../services";
import { GetByIdController } from "./GetByIdController";



const getByIdUseCase = new GetByIdUseCase(userRepo, authService);
const getByIdController = new GetByIdController(getByIdUseCase);

export { getByIdController}