import { transactionRepo } from "../../repos/implementation";
import { envelopeRepo } from "../../../envelopes/repos/implementation";
import { debtRepo } from "../../../debts/repos/implementation";
import { ResetAll } from "./ResetAll";

const resetAll = new ResetAll(transactionRepo, envelopeRepo, debtRepo);

export { resetAll };
