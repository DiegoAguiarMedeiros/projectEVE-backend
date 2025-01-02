import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Flags } from "../../../domain/flags";

export interface CreateCreditCardDTO {
  id: UniqueEntityID;
  name: string;
  flag: Flags;
  active: boolean;
  userId: string;
}