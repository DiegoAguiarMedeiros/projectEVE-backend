
import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { Envelopes } from "../domain/Envelopes";



export interface Interface extends ICRUD<Envelopes> {
  getByName(name: string, userId: string): Promise<Envelopes | null>;
  checkName(name: string, userId: string): Promise<boolean>;
  getOnlyById(id: string): Promise<Envelopes | null>;
}
