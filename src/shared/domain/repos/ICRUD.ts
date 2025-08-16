export interface ICRUD<T> {
  getAll(id: string, page?: number, pageSize?: number, orderBy?: string, order?: string): Promise<T[]>
  create(data: T): Promise<void>;
  getById(id: string, userId: string): Promise<T | null>;
  update(id: string, data: T): Promise<boolean>;
  delete(id: string): Promise<boolean>
}