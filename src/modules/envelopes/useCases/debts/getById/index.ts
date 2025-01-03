import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase'
import { debtRepo } from "../../../repos";

const getDebtByIdUseCase = new GetByIdUseCase(debtRepo);
const getDebtByIdController = new GetByIdController(getDebtByIdUseCase);

export { getDebtByIdController }