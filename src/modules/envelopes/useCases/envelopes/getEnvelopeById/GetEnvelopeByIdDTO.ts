import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Envelope } from "../../../domain/envelope";

export interface GetEnvelopeByIdDTOResponse {
    envelope: Envelope;
}
export interface GetEnvelopeByIdDTOResquest {
    envelopeId: UniqueEntityID;
    userId: UniqueEntityID;
}