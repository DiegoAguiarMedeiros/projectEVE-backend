import { DebtsStatus } from "../../../../domain/entities/debt/DebtsStatus";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    creditCardId?: string;
    envelopeId?: string;
    description?: string;
    amount?: number;
    installments_total?: number;
    installments_paid?: number;
    dueDate?: Date;
    status?: DebtsStatus;
}