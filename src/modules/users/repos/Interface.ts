import { Email } from "../domain/Email";
import { User } from "../domain/User";

export interface FindAllUsersFilters {
  page: number;
  limit: number;
  search?: string;
  isDeleted?: boolean;
  isAdmin?: boolean;
}

export interface FindAllUsersResult {
  users: User[];
  total: number;
}

export interface Interface {
  exists(data: Email): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByEmail(data: Email): Promise<User>;
  getUserByVerificationToken(token: string): Promise<User | null>;
  create(data: User): Promise<void>;
  save(data: User): Promise<void>;
  delete(userId: string): Promise<void>;
  findAll(filters: FindAllUsersFilters): Promise<FindAllUsersResult>;
}