import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";

export interface CreateDTO {
  id: UniqueEntityID;
  name: string;
  balance: number;
  active: boolean;
  is_editable: boolean;
  userId: string;
}