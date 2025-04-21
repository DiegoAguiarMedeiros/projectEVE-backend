import { DebtsStatus } from "../../../../domain/entities/debt/DebtsStatus";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    envelopeId?: string;
    description?: string;
    amount?: number;
    installmentsTotal?: number;
    installmentsPaid?: number;
    paymentDay?: number;
    status?: DebtsStatus;
}