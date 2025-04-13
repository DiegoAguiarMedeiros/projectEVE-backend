import { InvestmentsStatus } from "../../entities/investment/InvestmentsStatus";
import { InvestmentsType } from "../../entities/investment/InvestmentsType";


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
