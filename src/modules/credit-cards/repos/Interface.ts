import { ICRUD } from "../../../shared/domain/repos/ICRUD";
import { CreditCard } from "../domain";


export interface Interface extends ICRUD<CreditCard> {
  checkName(name: string, userId: string): Promise<boolean>;
  deleteAll(ids: string[], userId: string): Promise<number>;
}
