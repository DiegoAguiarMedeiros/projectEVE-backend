import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase'
import { incomesRepo } from "../../../repos";

const getIncomeByIdUseCase = new GetByIdUseCase(incomesRepo);
const getIncomeByIdController = new GetByIdController(getIncomeByIdUseCase);

export { getIncomeByIdController }