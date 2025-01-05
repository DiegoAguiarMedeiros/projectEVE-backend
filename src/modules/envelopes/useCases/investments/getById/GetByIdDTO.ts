import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Investments } from "../../../domain/investments";

export interface GetByIdDTO {
    investments: Investments;
}
export interface GetByIdDTOResquest {
    Id: UniqueEntityID;
    userId: UniqueEntityID;
}