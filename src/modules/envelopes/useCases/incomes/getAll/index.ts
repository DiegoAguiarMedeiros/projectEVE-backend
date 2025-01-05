
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { incomesRepo } from "../../../repos";

const getAllIncomeUseCase = new GetAllUseCase(incomesRepo);
const getAllIncomeController = new GetAllController(getAllIncomeUseCase);

export { getAllIncomeController, getAllIncomeUseCase }