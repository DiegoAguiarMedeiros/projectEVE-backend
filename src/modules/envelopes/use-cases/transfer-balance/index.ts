import { envelopeRepo } from "../../repos/implementation";
import { transactionRepo } from "../../../transactions/repos/implementation";
import { TransferEnvelopeBalanceController } from "./TransferEnvelopeBalanceController";
import { TransferEnvelopeBalanceUseCase } from "./TransferEnvelopeBalanceUseCase";

const transferEnvelopeBalanceUseCase = new TransferEnvelopeBalanceUseCase(envelopeRepo, transactionRepo);
const transferEnvelopeBalanceController = new TransferEnvelopeBalanceController(transferEnvelopeBalanceUseCase);

export { transferEnvelopeBalanceController };
