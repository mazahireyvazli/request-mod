export const isExtension = () =>
  !!(chrome && chrome.runtime && chrome.runtime.id);

export const appID = "request-mod";

export const storageKeyPrefix = `${appID}-db_`;
export const storageLastIdKey = `${appID}-lastid`;
export const storageLastPageKey = `${appID}-lastpage`;
