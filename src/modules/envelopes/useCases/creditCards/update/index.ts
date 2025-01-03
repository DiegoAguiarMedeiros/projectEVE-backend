import { UpdateController } from './UpdateController'
import { UpdateUseCase } from './UpdateUseCase'
import { creditCardRepo } from "../../../repos";
const updateCreditCardUseCase = new UpdateUseCase(creditCardRepo);
const updateCreditCardController = new UpdateController(updateCreditCardUseCase);

export { updateCreditCardController }