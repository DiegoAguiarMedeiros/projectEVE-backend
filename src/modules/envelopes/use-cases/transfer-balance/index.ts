import { envelopeRepo } from "../../repos/implementation";
import { createUseCase } from "../../../transactions/use-cases/create";
import { TransferEnvelopeBalanceController } from "./TransferEnvelopeBalanceController";
import { TransferEnvelopeBalanceUseCase } from "./TransferEnvelopeBalanceUseCase";

const transferEnvelopeBalanceUseCase = new TransferEnvelopeBalanceUseCase(envelopeRepo, createUseCase);
const transferEnvelopeBalanceController = new TransferEnvelopeBalanceController(transferEnvelopeBalanceUseCase);

export { transferEnvelopeBalanceController };
