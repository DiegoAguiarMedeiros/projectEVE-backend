
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { creditCardRepo } from "../../../repos";

const getAllCreditCardsUseCase = new GetAllUseCase(creditCardRepo);
const getAllCreditCardsController = new GetAllController(getAllCreditCardsUseCase);

export { getAllCreditCardsController, getAllCreditCardsUseCase }