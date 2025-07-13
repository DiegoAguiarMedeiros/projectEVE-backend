
import { FixedExpense } from "../domain/FixedExpense";
import { ICRUD } from "../../../shared/domain/repos/ICRUD";

export interface Interface extends ICRUD<FixedExpense> {
}
