import { Flags } from "../../../../domain/entities/creditCard/Flags";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    name?: string;
    flag?: Flags
}