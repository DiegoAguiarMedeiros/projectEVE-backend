import { processedIncomesRepo } from "../../repos/implementation";
import { deleteAll as deleteAllTransactions } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id";
import { DeleteAllUseCase } from "./DeleteAllUseCase";
import { DeleteAllController } from "./DeleteAllController";

const deleteAllUseCase = new DeleteAllUseCase(processedIncomesRepo, deleteAllTransactions);
const deleteAllController = new DeleteAllController(deleteAllUseCase);

export { deleteAllController };
