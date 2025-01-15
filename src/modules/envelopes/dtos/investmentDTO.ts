import { DebtsStatus } from "../domain/debtsStatus";
import { InvestmentsStatus } from "../domain/investmentsStatus";
import { InvestmentsType } from "../domain/investmentsType";

export interface InvestmentsDTO {
    id: string;
    envelopeId: string;
    description: string;
    type: InvestmentsType;
    amount: number;
    profitability: number;
    applicationDate: Date;
    maturityDate: Date;
    status: InvestmentsStatus;
}
