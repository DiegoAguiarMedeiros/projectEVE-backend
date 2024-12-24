
import { Envelope } from "../domain/envelope";

export interface IEnvelopeRepo {
  save(envelope: Envelope): Promise<void>;
}
