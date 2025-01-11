
import { Transaction } from "../domain/transaction";

export interface ITransactionRepo {
  getAll(id: string): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>;
  getById(id: string, userId: string): Promise<Transaction | null>;
  update(id: string, userId: string, transaction: Transaction): Promise<boolean>;
  delete(id: string): Promise<void>
}
