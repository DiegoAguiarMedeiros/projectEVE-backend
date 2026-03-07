import { ProcessAllUseCase } from "./ProcessAllUseCase";
import { ProcessAllController } from "./ProcessAllController";
import { processedIncomesRepo } from "../../repos/implementation";
import { incomeRepo } from "../../../incomes/repos/implementation";
import { deleteAll } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id";
import { transactionRepo } from "../../../transactions/repos/implementation";

const processAllUseCase = new ProcessAllUseCase(processedIncomesRepo, incomeRepo, deleteAll, transactionRepo);
const processAllController = new ProcessAllController(processAllUseCase);

export { processAllController };
