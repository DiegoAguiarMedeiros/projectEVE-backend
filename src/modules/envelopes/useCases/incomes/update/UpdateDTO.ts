import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { DebtsStatus } from "../../../domain/debtsStatus";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    description?: string;
    amount?: number;
    paymentDay?: number;
}