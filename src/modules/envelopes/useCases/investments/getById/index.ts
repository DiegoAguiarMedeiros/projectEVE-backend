import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase'
import { investmentsRepo } from "../../../repos";

const getDebtByIdUseCase = new GetByIdUseCase(investmentsRepo);
const getInvestmentByIdController = new GetByIdController(getDebtByIdUseCase);

export { getInvestmentByIdController }