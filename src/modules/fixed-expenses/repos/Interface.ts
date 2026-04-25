
import { FixedExpense } from "../domain/FixedExpense";
import { ICRUD } from "../../../shared/domain/repos/ICRUD";

export interface Interface extends ICRUD<FixedExpense> {
    deleteAll(ids: string[], userId: string): Promise<number>;
    getTotalByEnvelope(envelopeId: string): Promise<number>;
}
