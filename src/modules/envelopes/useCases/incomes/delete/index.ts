import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { incomesRepo } from "../../../repos";
const deleteIncomeUseCase = new DeleteUseCase(incomesRepo);
const deleteIncomeController = new DeleteController(deleteIncomeUseCase);

export { deleteIncomeController }