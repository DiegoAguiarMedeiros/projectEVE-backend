import { Flags } from "../../../../domain/entities/creditCard/Flags";
import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface CreateDTO {
  id: UniqueEntityID;
  name: string;
  flag: Flags;
  active: boolean;
  userId: string;
}