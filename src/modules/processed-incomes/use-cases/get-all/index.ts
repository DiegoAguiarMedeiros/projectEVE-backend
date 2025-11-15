import { GetAllUseCase } from "./GetAllUseCase";
import { GetAllController } from "./GetAllController";
import { processedIncomesRepo } from "../../repos/implementation";

const getAllUseCase = new GetAllUseCase(processedIncomesRepo);
const getAllController = new GetAllController(getAllUseCase);

export { getAllController }