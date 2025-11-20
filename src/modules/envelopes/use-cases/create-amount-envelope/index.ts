
import { transactionRepo } from "../../../transactions/repos/implementation";
import { envelopeRepo } from "../../repos/implementation";
import { Create } from "./Create";

const create = new Create(envelopeRepo)

export { create };