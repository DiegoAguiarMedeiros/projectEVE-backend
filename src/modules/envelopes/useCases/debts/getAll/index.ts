
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { debtRepo } from "../../../repos";

const getAllDebtUseCase = new GetAllUseCase(debtRepo);
const getAllDebtController = new GetAllController(getAllDebtUseCase);

export { getAllDebtController, getAllDebtUseCase }