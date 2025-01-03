import { UpdateController } from './UpdateController'
import { UpdateUseCase } from './UpdateUseCase'
import { debtRepo } from "../../../repos";
const updatedDebtUseCase = new UpdateUseCase(debtRepo);
const updatedDebtController = new UpdateController(updatedDebtUseCase);

export { updatedDebtController }