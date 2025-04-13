import { GetAllUseCase } from "../../../../../application/useCases/transaction/getAll/GetAllUseCase";
import { transactionRepo } from "../../../../../domain/repositories";
import { GetAllController } from "./GetAllController";

const getAllUseCase = new GetAllUseCase(transactionRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }