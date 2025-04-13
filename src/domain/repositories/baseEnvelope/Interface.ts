import { BaseEnvelope } from "../../entities/baseEnvelope/BaseEnvelope";

export interface Interface  {
  getAll(): Promise<BaseEnvelope[]>
  save(baseEnvelope: BaseEnvelope): Promise<void>;
}
