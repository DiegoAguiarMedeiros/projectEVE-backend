import { Email } from "../../entities/user/Email";
import { User } from "../../entities/user/User";


export interface Interface {
  exists(data: Email): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(data: Email): Promise<User>;
  create(data: User): Promise<void>;
}