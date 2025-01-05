import { UpdateController } from './UpdateController'
import { UpdateUseCase } from './UpdateUseCase'
import { investmentsRepo } from "../../../repos";
const updatedInvestmentsUseCase = new UpdateUseCase(investmentsRepo);
const updatedInvestmentsController = new UpdateController(updatedInvestmentsUseCase);

export { updatedInvestmentsController }