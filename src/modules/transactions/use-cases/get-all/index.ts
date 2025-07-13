import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { transactionRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(transactionRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }