import { isExtension, storageKeyPrefix } from "../utils/common";
import { ChromeStorage } from "./chrome.storage";

export interface GlobalStorage<T> {
  getPrefixedKey(key: string): string;
  set(id: string, data: T): Promise<string>;
  get(id: string): Promise<T>;
  getAll(): Promise<T[]>;
}

export class LocalStorage<T> implements GlobalStorage<T> {
  private keyPrefix: string = "";

  constructor(keyPrefix: string) {
    this.keyPrefix = keyPrefix;
  }

  getPrefixedKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async set(id: string, data: T) {
    return new Promise<string>((resolve, reject) => {
      localStorage.setItem(this.getPrefixedKey(id), JSON.stringify(data));

      resolve(id);
    });
  }

  async get(id: string) {
    return new Promise<T>((resolve, reject) => {
      resolve(JSON.parse(localStorage.getItem(this.getPrefixedKey(id))!));
    });
  }

  async getAll() {
    return new Promise<T[]>((resolve, reject) => {
      const result: T[] = Object.keys(localStorage)
        .filter((key) => key.startsWith(this.keyPrefix))
        .map((key) => {
          return JSON.parse(localStorage.getItem(key)!);
        });

      return resolve(result);
    });
  }
}

export const createStorage = <T>(): GlobalStorage<T> => {
  if (isExtension()) {
    return new ChromeStorage(storageKeyPrefix);
  }

  return new LocalStorage(storageKeyPrefix);
};
