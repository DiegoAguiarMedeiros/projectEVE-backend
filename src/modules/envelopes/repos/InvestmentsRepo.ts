
import { Debt } from "../domain/debt";
import { Investments } from "../domain/investments";

export interface IInvestmentsRepo {
  getAll(id: string): Promise<Investments[]>
  save(investment: Investments): Promise<void>;
  getById(id: string, userId: string): Promise<Debt | null>;
  update(id: string, userId: string, investment: Investments): Promise<boolean>;
  delete(id: string): Promise<void>
}
