import { Transaction } from "../../../../domain/entities/transaction/Transaction";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface GetByIdDTOResponse {
    transaction: Transaction;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}