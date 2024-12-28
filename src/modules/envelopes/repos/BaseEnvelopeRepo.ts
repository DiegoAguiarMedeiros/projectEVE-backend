
import { BaseEnvelope } from "../domain/baseEnvelope";

export interface IBaseEnvelopeRepo {
  getAll(): Promise<BaseEnvelope[]>
  save(baseEnvelope: BaseEnvelope): Promise<void>;
}
