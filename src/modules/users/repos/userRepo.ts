
import { User } from "../domain/user";
import { Email } from "../domain/email";

export interface IUserRepo {
  exists(userEmail: Email): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(email: Email | string): Promise<User>;
  save(user: User): Promise<void>;
}
