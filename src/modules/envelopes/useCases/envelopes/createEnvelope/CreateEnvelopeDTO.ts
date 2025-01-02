import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

export interface CreateEnvelopeDTO {
  id: UniqueEntityID;
  name: string;
  balance: number;
  active: boolean;
  is_editable: boolean;
  userId: string;
}