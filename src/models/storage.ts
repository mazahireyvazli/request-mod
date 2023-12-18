export interface GlobalStorage<T> {
  getPrefixedKey(key: string | number): string;
  getNextId(): Promise<number>;
  set(id: number, data: T): Promise<number>;
  get(id: number): Promise<T>;
  getAll(): Promise<T[]>;
  delete(id: number): Promise<number>;
}
