import { Envelope } from "../../../../domain/entities/envelope/Envelope";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface GetByIdDTO {
    envelope: Envelope;
}
export interface GetByIdDTOResquest {
    envelopeId: UniqueEntityID;
    userId: UniqueEntityID;
}