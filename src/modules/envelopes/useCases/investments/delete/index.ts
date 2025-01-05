import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { investmentsRepo } from "../../../repos";
const deleteInvestmentsUseCase = new DeleteUseCase(investmentsRepo);
const deleteInvestmentsController = new DeleteController(deleteInvestmentsUseCase);

export { deleteInvestmentsController }