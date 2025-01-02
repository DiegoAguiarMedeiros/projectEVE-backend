import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

export interface DeleteDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
}