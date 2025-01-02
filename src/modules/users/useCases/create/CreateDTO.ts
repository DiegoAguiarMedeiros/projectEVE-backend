import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export interface CreateDTO {
  id: UniqueEntityID;
  name: string;
  email: string;
  password: string;
}