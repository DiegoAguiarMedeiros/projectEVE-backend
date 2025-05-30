
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { creditCardRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(creditCardRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }