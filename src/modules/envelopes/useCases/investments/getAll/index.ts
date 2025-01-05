
import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { investmentsRepo } from "../../../repos";

const getAllInvestmentsUseCase = new GetAllUseCase(investmentsRepo);
const getAllInvestmentsController = new GetAllController(getAllInvestmentsUseCase);

export { getAllInvestmentsController, getAllInvestmentsUseCase }