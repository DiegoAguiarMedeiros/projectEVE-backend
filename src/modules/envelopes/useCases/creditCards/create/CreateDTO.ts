import { UniqueEntityID } from "../../../../../shared/domain/UniqueEntityID";
import { Flags } from "../../../domain/flags";

export interface CreateDTO {
  id: UniqueEntityID;
  name: string;
  flag: Flags;
  active: boolean;
  userId: string;
}