import { Email } from "../domain/Email";
import { User } from "../domain/User";



export interface Interface {
  exists(data: Email): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(data: Email): Promise<User>;
  getUserByVerificationToken(token: string): Promise<User | null>;
  create(data: User): Promise<void>;
  save(data: User): Promise<void>;
  delete(userId: string): Promise<void>;
}