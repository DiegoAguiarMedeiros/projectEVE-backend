
import { processedIncomesRepo } from "../../repos/implementation";
import { GetProcessedMonthController } from "./GetProcessedMonthController";
import { GetProcessedMonthUseCase } from "./GetProcessedMonthUseCase";

const getProcessedMonthUseCase = new GetProcessedMonthUseCase(processedIncomesRepo);
const getProcessedMonthController = new GetProcessedMonthController(getProcessedMonthUseCase);

export { getProcessedMonthController }