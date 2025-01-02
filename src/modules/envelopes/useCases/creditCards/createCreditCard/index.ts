
import { CreateCreditCardUseCase } from "./CreateCreditCardUseCase";
import { CreateCreditCardController } from "./CreateCreditCardController";
import { creditCardRepo } from "../../../repos";

const createCreditCardUseCase = new CreateCreditCardUseCase(creditCardRepo);
const createCreditCardController = new CreateCreditCardController(
    createCreditCardUseCase
)

export {
    createCreditCardUseCase,
    createCreditCardController
}