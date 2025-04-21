import { GetAllUseCase } from "../../../../../application/useCases/fixedExpense/getAll/GetAllUseCase";
import { fixedExpenseRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(fixedExpenseRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }