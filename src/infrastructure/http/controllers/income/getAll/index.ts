import { GetAllUseCase } from "../../../../../application/useCases/income/getAll/GetAllUseCase";
import { incomeRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(incomeRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }