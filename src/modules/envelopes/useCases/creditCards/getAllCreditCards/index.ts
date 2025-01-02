
import { GetAllCreditCardsUseCase } from "./GetAllCreditCardsUseCase";
import { GetAllCreditCardsController } from "./GetAllCreditCardsController";
import { creditCardRepo } from "../../../repos";

const getAllCreditCardsUseCase = new GetAllCreditCardsUseCase(creditCardRepo);
const getAllCreditCardsController = new GetAllCreditCardsController(getAllCreditCardsUseCase);

export { getAllCreditCardsController, getAllCreditCardsUseCase }