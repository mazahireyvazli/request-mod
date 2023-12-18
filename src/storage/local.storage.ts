import { GlobalStorage } from "../models/storage";

export class LocalStorage<T> implements GlobalStorage<T> {
  private keyPrefix: string = "";
  private lastIdKey: string = "";

  constructor(keyPrefix: string, lastIdKey: string) {
    this.keyPrefix = keyPrefix;
    this.lastIdKey = lastIdKey;
  }

  getPrefixedKey(key: string | number): string {
    return `${this.keyPrefix}${key}`;
  }

  getNextId(): Promise<number> {
    return new Promise<number>((resolve, _reject) => {
      const lastIdRaw = localStorage.getItem(this.lastIdKey);
      const lastId = lastIdRaw ? Number(lastIdRaw) : 0;

      const nextId = lastId + 1;

      localStorage.setItem(this.lastIdKey, nextId.toString());

      resolve(nextId);
    });
  }

  async set(id: number, data: T) {
    return new Promise<number>((resolve, _reject) => {
      localStorage.setItem(this.getPrefixedKey(id), JSON.stringify(data));

      resolve(id);
    });
  }

  async get(id: number) {
    return new Promise<T>((resolve, _reject) => {
      resolve(JSON.parse(localStorage.getItem(this.getPrefixedKey(id))!));
    });
  }

  async getAll() {
    return new Promise<T[]>((resolve, _reject) => {
      const result: T[] = Object.keys(localStorage)
        .filter((key) => key.startsWith(this.keyPrefix))
        .map((key) => {
          return JSON.parse(localStorage.getItem(key)!);
        });

      return resolve(result);
    });
  }

  async delete(id: number): Promise<number> {
    return new Promise<number>((resolve, _reject) => {
      localStorage.removeItem(this.getPrefixedKey(id));

      resolve(1);
    });
  }
}
