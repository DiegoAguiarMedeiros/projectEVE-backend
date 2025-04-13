import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    description?: string;
    amount?: number;
    paymentDay?: number;
}