import { processedIncomesRepo } from "../../repos/implementation";
import { DeleteByMonthUseCase } from "./DeleteByMonthUseCase";
import { DeleteByMonthController } from "./DeleteByMonthController";
import { resetAll } from "../../../transactions/use-cases/reset-all-by-processed-incomes-id";
import { transactionRepo } from "../../../transactions/repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { debtRepo } from "../../../debts/repos/implementation";

const deleteByMonthUseCase = new DeleteByMonthUseCase(
    processedIncomesRepo,
    resetAll,
    transactionRepo,
    envelopeRepo,
    debtRepo,
);
const deleteByMonthController = new DeleteByMonthController(deleteByMonthUseCase);

export { deleteByMonthController };
