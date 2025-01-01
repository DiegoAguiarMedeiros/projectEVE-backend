
import { Envelope } from "../domain/envelope";

export interface IEnvelopeRepo {
  getAll(id: string): Promise<Envelope[]>
  save(envelope: Envelope): Promise<void>;
  getById(id: string, userId: string): Promise<Envelope | null>;
  checkName(name: string, userId: string): Promise<boolean>;
  updateName(id: string, userId: string, name: string): Promise<boolean>;
  delete(id: string): Promise<void>
}
