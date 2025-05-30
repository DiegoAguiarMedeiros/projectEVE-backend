import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { fixedExpenseRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(fixedExpenseRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }