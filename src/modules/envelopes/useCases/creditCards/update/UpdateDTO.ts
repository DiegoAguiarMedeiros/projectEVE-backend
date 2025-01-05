import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Flags } from "../../../domain/flags";

export interface UpdateDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    name?: string;
    flag?: Flags
}