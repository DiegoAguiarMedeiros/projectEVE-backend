import { processedIncomesRepo } from "../../repos/implementation";
import { deleteAll as deleteAllTransactions } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id";
import { DeleteByMonthUseCase } from "./DeleteByMonthUseCase";
import { DeleteByMonthController } from "./DeleteByMonthController";

const deleteByMonthUseCase = new DeleteByMonthUseCase(processedIncomesRepo, deleteAllTransactions);
const deleteByMonthController = new DeleteByMonthController(deleteByMonthUseCase);

export { deleteByMonthController };
