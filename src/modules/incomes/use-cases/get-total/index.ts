import { GetTotalUseCase } from "./GetTotalUseCase";
import { GetTotalController } from "./GetTotalController";
import { incomeRepo } from "../../repos/implementation";

const getTotalUseCase = new GetTotalUseCase(incomeRepo);
const getTotalController = new GetTotalController(getTotalUseCase);

export { getTotalController }