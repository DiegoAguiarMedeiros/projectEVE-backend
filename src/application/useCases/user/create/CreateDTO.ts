import { UniqueEntityID } from "../../../../domain/shared/UniqueEntityID";

export interface CreateDTO {
  id: UniqueEntityID;
  name: string;
  email: string;
  password: string;
}