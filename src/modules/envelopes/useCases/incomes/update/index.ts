import { UpdateController } from './UpdateController'
import { UpdateUseCase } from './UpdateUseCase'
import { incomesRepo } from "../../../repos";
const updatedIncomeUseCase = new UpdateUseCase(incomesRepo);
const updatedIncomeController = new UpdateController(updatedIncomeUseCase);

export { updatedIncomeController }