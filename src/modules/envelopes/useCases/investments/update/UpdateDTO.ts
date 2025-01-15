import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "../../../domain/debtsStatus";
import { InvestmentsStatus } from "../../../domain/investmentsStatus";
import { InvestmentsType } from "../../../domain/investmentsType";

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