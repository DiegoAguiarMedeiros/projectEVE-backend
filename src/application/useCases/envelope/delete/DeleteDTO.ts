import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface DeleteDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
}