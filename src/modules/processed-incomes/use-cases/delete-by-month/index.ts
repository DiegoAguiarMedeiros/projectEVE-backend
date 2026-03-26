import { processedIncomesRepo } from "../../repos/implementation";
import { DeleteByMonthUseCase } from "./DeleteByMonthUseCase";
import { DeleteByMonthController } from "./DeleteByMonthController";
import { resetAll } from "../../../transactions/use-cases/reset-all-by-processed-incomes-id";

const deleteByMonthUseCase = new DeleteByMonthUseCase(processedIncomesRepo, resetAll);
const deleteByMonthController = new DeleteByMonthController(deleteByMonthUseCase);

export { deleteByMonthController };
