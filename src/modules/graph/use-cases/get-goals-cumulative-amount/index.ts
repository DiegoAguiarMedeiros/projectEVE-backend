import { transactionRepo } from "../../../transactions/repos/implementation";
import { GetGoalsCumulativeAmountUseCase } from "./GetGoalsCumulativeAmountUseCase";
import { GetGoalsCumulativeAmountController } from "./GetGoalsCumulativeAmountController";

const getGoalsCumulativeAmountUseCase = new GetGoalsCumulativeAmountUseCase(transactionRepo);
const getGoalsCumulativeAmountController = new GetGoalsCumulativeAmountController(getGoalsCumulativeAmountUseCase);

export { getGoalsCumulativeAmountController };
