import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { CreditCard } from "../../../domain/creditCard";

export interface GetByIdDTOResponse {
    creditCard: CreditCard;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}