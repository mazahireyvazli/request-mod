import { on } from "svelte/events";
import { createSubscriber } from "svelte/reactivity";

export interface Serializer<T> {
  parse(raw: string): T;
  stringify(value: T): string;
}

export interface PersistedStateOptions<T> {
  storage?: Storage;
  serializer?: Serializer<T>;
  syncTabs?: boolean;
}

export class PersistedState<T> {
  #key: string;
  #storage: Storage;
  #serializer: Serializer<T>;
  #syncTabs: boolean;

  #initialValue: T;

  #subscribe: () => void;
  #updateSubscribers?: () => void;

  constructor(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
    this.#key = key;
    this.#serializer = options.serializer ?? (JSON as Serializer<T>);
    this.#syncTabs = options.syncTabs ?? true;
    this.#storage = options.storage ?? globalThis.localStorage;

    this.#initialValue = initialValue;

    this.#subscribe = createSubscriber((update) => {
      this.#updateSubscribers = update;

      const off = on(window, "storage", (event) => {
        if (!this.#syncTabs || event.storageArea !== this.#storage || event.key !== this.#key) return;

        update();
      });

      return () => off();
    });
  }

  get value(): T {
    this.#subscribe();

    return this.#read();
  }

  set value(next: T) {
    this.#write(next);

    this.#updateSubscribers?.();
  }

  #read(): T {
    try {
      const raw = this.#storage.getItem(this.#key);
      return raw !== null ? this.#serializer.parse(raw) : this.#initialValue;
    } catch {
      return this.#initialValue;
    }
  }

  #write(value: T): void {
    try {
      this.#storage.setItem(this.#key, this.#serializer.stringify(value));
    } catch {
      // storage full or unavailable
    }
  }
}
