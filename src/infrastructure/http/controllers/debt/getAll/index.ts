
import { GetAllUseCase } from "../../../../../application/useCases/debt/getAll/GetAllUseCase";
import { debtRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(debtRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController, getAllUseCase }