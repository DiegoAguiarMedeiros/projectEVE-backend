import { GetByIdController } from './GetByIdController'
import { GetByIdUseCase } from './GetByIdUseCase'
import { creditCardRepo } from "../../../repos";

const getCreditCardByIdUseCase = new GetByIdUseCase(creditCardRepo);
const getCreditCardByIdController = new GetByIdController(getCreditCardByIdUseCase);

export { getCreditCardByIdController }