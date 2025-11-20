
import { transactionRepo } from "../../../transactions/repos/implementation";
import { envelopeRepo } from "../../repos/implementation";
import { Update } from "./Update";
import { Update as UpdateEnvelopeAmount } from "../update-amount-envelope/Update";

const updateEnvelopeAmount = new UpdateEnvelopeAmount(envelopeRepo)
const update = new Update(
  envelopeRepo, transactionRepo, updateEnvelopeAmount
)

export { update };