import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { goalsRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(goalsRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }