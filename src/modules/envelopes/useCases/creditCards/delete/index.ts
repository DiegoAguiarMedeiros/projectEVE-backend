import { DeleteController } from './DeleteController'
import { DeleteUseCase } from './DeleteUseCase'
import { creditCardRepo } from "../../../repos";
const deleteCreditCardUseCase = new DeleteUseCase(creditCardRepo);
const deleteCreditCardController = new DeleteController(deleteCreditCardUseCase);

export { deleteCreditCardController }