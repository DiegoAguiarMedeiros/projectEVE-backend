
import { GetAllUseCase } from "../../../../../application/useCases/creditCard/getAll/GetAllUseCase";
import { creditCardRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(creditCardRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }