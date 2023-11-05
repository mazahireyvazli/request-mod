import { GlobalStorage } from "./storage";

export class ChromeStorage<T> implements GlobalStorage<T> {
  private keyPrefix: string = "";

  constructor(keyPrefix: string) {
    this.keyPrefix = keyPrefix;
  }

  getPrefixedKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async set(id: string, data: T) {
    return new Promise<string>((resolve, reject) => {
      chrome.storage.sync.set({ [this.getPrefixedKey(id)]: data }, () => {
        return resolve(id);
      });
    });
  }

  async get(id: string) {
    return new Promise<T>((resolve, reject) => {
      chrome.storage.sync.get(this.getPrefixedKey(id), (results) => {
        return resolve(results[id]);
      });
    });
  }

  async getAll() {
    return new Promise<T[]>((resolve, reject) => {
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
