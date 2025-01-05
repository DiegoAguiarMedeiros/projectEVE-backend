import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Debt } from "../../../domain/debt";

export interface GetByIdDTOResponse {
    debt: Debt;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}