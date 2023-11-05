export const isExtension = () =>
  !!(window.chrome && chrome.runtime && chrome.runtime.id);

export const appID = "request-mod";

export const storageKeyPrefix = `${appID}_`;
