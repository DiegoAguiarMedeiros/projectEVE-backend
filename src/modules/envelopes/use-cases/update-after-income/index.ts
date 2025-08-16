
import { incomeRepo } from "../../../incomes/repos/implementation";
import { debtRepo } from "../../../debts/repos/implementation";
import { envelopeRepo } from "../../repos/implementation";
import { Update } from "./Update";

const update = new Update(
  envelopeRepo, incomeRepo, debtRepo
)

export { update };