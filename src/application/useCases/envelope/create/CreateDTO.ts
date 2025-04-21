import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface CreateDTO {
  id: UniqueEntityID;
  name: string;
  balance: number;
  color: string;
  percentage: number;
  active: boolean;
  is_editable: boolean;
  userId: string;
}