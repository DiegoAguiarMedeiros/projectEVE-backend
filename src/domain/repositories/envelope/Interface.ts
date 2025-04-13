
import { Envelope } from "../../entities/envelope/Envelope";
import { ICRUD } from "../ICRUD";



export interface Interface extends ICRUD<Envelope> {
  getByName(name: string, userId: string): Promise<Envelope | null>;
  checkName(name: string, userId: string): Promise<boolean>;
}
