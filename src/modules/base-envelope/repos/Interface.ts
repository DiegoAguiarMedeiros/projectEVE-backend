import { BaseEnvelope } from "../domain/BaseEnvelope";


export interface Interface  {
  getAll(): Promise<BaseEnvelope[]>
  getById(id: string): Promise<BaseEnvelope | null>;
  save(baseEnvelope: BaseEnvelope): Promise<void>;
  update(id: string, data: { name?: string; color?: string; order?: number }): Promise<void>;
  delete(id: string): Promise<void>;
}
