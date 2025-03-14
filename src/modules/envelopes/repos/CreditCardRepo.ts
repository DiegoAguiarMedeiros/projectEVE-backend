
import { CreditCard } from "../domain/creditCard";

export interface ICreditCardRepo {
  getAll(id: string, page?: number, pageSize?: number): Promise<CreditCard[]>
  save(creditCard: CreditCard): Promise<void>;
  getById(id: string, userId: string): Promise<CreditCard | null>;
  checkName(name: string, userId: string): Promise<boolean>;
  update(id: string, userId: string, creditCard: CreditCard): Promise<boolean>;
  delete(id: string): Promise<void>
}
