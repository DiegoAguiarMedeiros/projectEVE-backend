import { processedIncomesRepo } from "../../repos/implementation";
import { deleteAll } from "../../../transactions/use-cases/delete-all-by-processed-incomes-id";
import { DeleteUseCase } from "./DeleteUseCase";
import { DeleteController } from "./DeleteController";

const deleteUseCase = new DeleteUseCase(processedIncomesRepo, deleteAll);
const deleteController = new DeleteController(deleteUseCase);

export { deleteController };
