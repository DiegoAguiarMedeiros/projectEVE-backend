import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Envelope } from "../../../domain/envelope";

export interface GetByIdDTOResponse {
    envelope: Envelope;
}
export interface GetByIdDTOResquest {
    envelopeId: UniqueEntityID;
    userId: UniqueEntityID;
}