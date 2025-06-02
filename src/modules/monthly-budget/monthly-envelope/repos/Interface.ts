
import { ICRUD } from "../../../../shared/domain/repos/ICRUD";
import { MonthlyEnvelope } from "../domain";



export interface Interface extends ICRUD<MonthlyEnvelope> {
    getByReferenceAndEnvelopeId(reference: string, envelopeId: string): Promise<MonthlyEnvelope | null>;
}
