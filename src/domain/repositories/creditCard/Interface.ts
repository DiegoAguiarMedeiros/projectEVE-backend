import { CreditCard } from "../../entities/creditCard/CreditCard";
import { ICRUD } from "../ICRUD";

export interface Interface extends ICRUD<CreditCard> {
  checkName(name: string, userId: string): Promise<boolean>;
}
