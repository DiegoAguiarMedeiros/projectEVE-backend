import { Debt } from "../../../../domain/entities/debt/Debt";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface GetByIdDTOResponse {
    debt: Debt;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}