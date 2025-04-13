import { CreditCard } from "../../../../domain/entities/creditCard/CreditCard";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface GetByIdDTOResponse {
    creditCard: CreditCard;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}