
import { Envelope } from "../domain/envelope";

export interface IEnvelopeRepo {
  getAll(): Promise<Envelope[]>
  save(envelope: Envelope): Promise<void>;
}
