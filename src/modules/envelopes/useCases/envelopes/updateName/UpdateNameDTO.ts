import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Name } from "../../../domain/name";

export interface UpdateNameDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    name: string
}
export interface UpdateNameDTORequest {
    name: string
}