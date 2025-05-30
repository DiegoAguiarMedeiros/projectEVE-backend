import { Email } from "../domain/Email";
import { User } from "../domain/User";



export interface Interface {
  exists(data: Email): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(data: Email): Promise<User>;
  create(data: User): Promise<void>;
}