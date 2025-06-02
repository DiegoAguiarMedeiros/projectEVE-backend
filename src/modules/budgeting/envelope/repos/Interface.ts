
import { ICRUD } from "../../../../shared/domain/repos/ICRUD";
import { Envelope } from "../domain/Envelope";



export interface Interface extends ICRUD<Envelope> {
  getByName(name: string, userId: string): Promise<Envelope | null>;
  checkName(name: string, userId: string): Promise<boolean>;
  getOnlyById(id: string): Promise<Envelope | null>;
}
