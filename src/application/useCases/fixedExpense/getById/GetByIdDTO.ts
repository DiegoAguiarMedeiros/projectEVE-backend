import { FixedExpense } from "../../../../domain/entities/fixedExpense/FixedExpense";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface GetByIdDTO {
    fixedExpense: FixedExpense;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}