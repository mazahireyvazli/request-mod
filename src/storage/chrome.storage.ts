import { GlobalStorage } from "./storage";

export class ChromeStorage<T> implements GlobalStorage<T> {
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
      chrome.storage.sync.get(this.lastIdKey, (results) => {
        const lastIdRaw = results[this.lastIdKey];
        const lastId = lastIdRaw ? Number(lastIdRaw) : 0;

        const nextId = lastId + 1;

        chrome.storage.sync.set({
          [this.lastIdKey]: nextId,
        });

        resolve(nextId);
      });
    });
  }

  async set(id: number, data: T) {
    return new Promise<number>((resolve, _reject) => {
      chrome.storage.sync.set({ [this.getPrefixedKey(id)]: data }, () => {
        return resolve(id);
      });
    });
  }

  async get(id: number) {
    return new Promise<T>((resolve, _reject) => {
      chrome.storage.sync.get(this.getPrefixedKey(id), (results) => {
        return resolve(results[this.getPrefixedKey(id)]);
      });
    });
  }

  async getAll() {
    return new Promise<T[]>((resolve, _reject) => {
      chrome.storage.sync.get((items) => {
        const result: T[] = Object.keys(items)
          .filter((key) => key.startsWith(this.keyPrefix))
          .map((key) => {
            return items[key];
          });

        return resolve(result);
      });
    });
  }
}
