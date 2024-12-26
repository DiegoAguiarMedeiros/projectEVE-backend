
import { User } from "../domain/user";
import { Email } from "../domain/email";
import { Name } from "../domain/name";

export interface IUserRepo {
  exists(email: Email): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(email: Email): Promise<User>;
  save(user: User): Promise<void>;
}