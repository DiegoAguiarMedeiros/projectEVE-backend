import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export interface CreateUserDTO {
  id: UniqueEntityID;
  name: string;
  email: string;
  password: string;
}