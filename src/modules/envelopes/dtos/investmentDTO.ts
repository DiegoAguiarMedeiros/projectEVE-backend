import { DebtsStatus } from "../domain/debtsStatus";
import { InvestmentsStatus } from "../domain/investmentsStatus";
import { InvestmentsType } from "../domain/investmentsType";

export interface InvestmentsDTO {
    id: string;
    userId: string;
    description: string;
    type: InvestmentsType;
    amount: number;
    applicationDate: Date;
    maturityDate: Date;
    status: InvestmentsStatus;
}
