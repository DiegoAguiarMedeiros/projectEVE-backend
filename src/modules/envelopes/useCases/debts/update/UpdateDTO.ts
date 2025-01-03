import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "../../../domain/debtsStatus";

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