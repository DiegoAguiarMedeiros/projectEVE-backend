
import { processedIncomesRepo } from "../../repos/implementation";
import { GetTotalController } from "./GetTotalController";
import { GetTotalUseCase } from "./GetTotalUseCase";

const getTotalUseCase = new GetTotalUseCase(processedIncomesRepo);
const getTotalController = new GetTotalController(getTotalUseCase);

export { getTotalController }