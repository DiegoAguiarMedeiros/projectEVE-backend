
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { transactionRepo } from "../../../repos";

const getAllTransactionUseCase = new GetAllUseCase(transactionRepo);
const getAllTransactionController = new GetAllController(getAllTransactionUseCase);

export { getAllTransactionController, getAllTransactionUseCase }