
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { Envelopes } from "../domain/Envelopes";



export interface Interface extends ICRUD<Envelopes> {
  getByName(name: string, userId: string): Promise<Envelopes | null>;
  checkName(name: string, userId: string): Promise<boolean>;
  getOnlyById(id: string): Promise<Envelopes | null>;
  getAllMonthly(id: string, year: number, month: number,): Promise<Envelopes[]>
  createAmount(envelopeId: string, amount: number, year: number, month: number): Promise<void>;
  addAmount(envelopeId: string, amount: number, year: number, month: number): Promise<void>;
  getAmount(envelopeId: string, year: number, month: number): Promise<number | null>;
}
