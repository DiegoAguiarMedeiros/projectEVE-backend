import { InvestmentsStatus } from "../../../../domain/entities/investment/InvestmentsStatus";
import { InvestmentsType } from "../../../../domain/entities/investment/InvestmentsType";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";


export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    description: string;
    type: InvestmentsType;
    amount: number;
    profitability: number;
    applicationDate: Date;
    maturityDate: Date;
    status: InvestmentsStatus;
}