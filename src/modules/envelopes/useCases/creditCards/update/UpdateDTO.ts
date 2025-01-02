import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    name: string;
    flag: string
}