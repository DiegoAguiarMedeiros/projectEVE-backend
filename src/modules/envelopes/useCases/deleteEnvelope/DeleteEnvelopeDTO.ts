import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export interface DeleteEnvelopeDTO {
    id: UniqueEntityID;
    userId: UniqueEntityID;
}