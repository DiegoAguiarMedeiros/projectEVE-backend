
import { Income } from "../domain/income";

export interface IIncomesRepo {
  getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<Income[]>
  save(income: Income): Promise<void>;
  getById(id: string, userId: string): Promise<Income | null>;
  update(id: string, userId: string, income: Income): Promise<boolean>;
  delete(id: string): Promise<void>
}
