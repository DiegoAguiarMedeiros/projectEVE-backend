import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";


export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    name: string
}
export interface UpdateDTORequest {
    name: string
}