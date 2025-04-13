import { Investment } from "../../../../domain/entities/investment/Investment";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface GetByIdDTO {
    investment: Investment;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}