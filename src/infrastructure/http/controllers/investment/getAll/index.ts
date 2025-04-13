import { GetAllUseCase } from "../../../../../application/useCases/investment/getAll/GetAllUseCase";
import { investmentRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(investmentRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }