import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Transaction } from "../../../domain/transaction";

export interface GetByIdDTOResponse {
    transaction: Transaction;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}