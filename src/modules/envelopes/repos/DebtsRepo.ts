
import { Debt } from "../domain/debt";

export interface IDebtRepo {
  getAll(id: string): Promise<Debt[]>
  save(Debt: Debt): Promise<void>;
  getById(id: string, userId: string): Promise<Debt | null>;
  update(id: string, userId: string, debt: Debt): Promise<boolean>;
  delete(id: string): Promise<void>
}
