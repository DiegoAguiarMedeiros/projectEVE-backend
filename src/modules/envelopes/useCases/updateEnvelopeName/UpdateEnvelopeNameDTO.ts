import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Name } from "../../domain/name";

export interface UpdateEnvelopeNameDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
    name: string
}
export interface UpdateEnvelopeNameDTORequest {
    name: string
}