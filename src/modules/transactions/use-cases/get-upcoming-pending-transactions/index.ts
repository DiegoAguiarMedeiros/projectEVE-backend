import { GetUpcomingPendingTransactionUseCase } from "./GetUpcomingPendingTransactionUseCase";
import { GetUpcomingPendingTransactionController } from "./GetUpcomingPendingTransactionController";
import { transactionRepo } from "../../repos/implementation";

const getUpcomingPendingTransactionUseCase = new GetUpcomingPendingTransactionUseCase(transactionRepo);
const getUpcomingPendingTransactionController = new GetUpcomingPendingTransactionController(getUpcomingPendingTransactionUseCase);

export { getUpcomingPendingTransactionController }