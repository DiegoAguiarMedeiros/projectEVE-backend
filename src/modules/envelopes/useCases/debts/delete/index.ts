import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { debtRepo } from "../../../repos";
const deleteDebtUseCase = new DeleteUseCase(debtRepo);
const deleteDebtController = new DeleteController(deleteDebtUseCase);

export { deleteDebtController }