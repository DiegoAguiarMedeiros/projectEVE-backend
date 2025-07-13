import { BaseEnvelope } from "../domain/BaseEnvelope";


export interface Interface  {
  getAll(): Promise<BaseEnvelope[]>
  save(baseEnvelope: BaseEnvelope): Promise<void>;
}
