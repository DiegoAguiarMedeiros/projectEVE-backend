import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { incomeRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(incomeRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }