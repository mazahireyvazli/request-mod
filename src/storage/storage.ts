import { GlobalStorage } from "../models/storage";
import {
  isExtension,
  storageKeyPrefix,
  storageLastIdKey,
} from "../utils/common";
import { ChromeStorage } from "./chrome.storage";
import { LocalStorage } from "./local.storage";

export const createStorage = <T>(
  keyPrefix = storageKeyPrefix,
  lastIdKey = storageLastIdKey,
): GlobalStorage<T> => {
  if (isExtension()) {
    return new ChromeStorage(keyPrefix, lastIdKey);
  }

  return new LocalStorage(keyPrefix, lastIdKey);
};
