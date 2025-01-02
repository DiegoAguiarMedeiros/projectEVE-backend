
import { CreateUseCase } from "./CreateUseCase";
import { CreateController } from "./CreateController";
import { creditCardRepo } from "../../../repos";

const createCreditCardUseCase = new CreateUseCase(creditCardRepo);
const createCreditCardController = new CreateController(
    createCreditCardUseCase
)

export {
    createCreditCardUseCase,
    createCreditCardController
}