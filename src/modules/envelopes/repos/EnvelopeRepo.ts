
import { Envelope } from "../domain/envelope";

export interface IEnvelopeRepo {
  getAll(id: string): Promise<Envelope[]>
  save(envelope: Envelope): Promise<void>;
}
