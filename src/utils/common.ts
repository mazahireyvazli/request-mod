export const isExtension = () =>
  !!(chrome && chrome.runtime && chrome.runtime.id && chrome.identity);

export const appID = "request-mod";

export const storageLastPageKey = `${appID}-lastpage`;
export const storageExtensionDisabledKey = `${appID}-extension-disabled`;

export const getCompiledValue = (
  str: string,
  vars?: Record<string, string>,
) => {
  if (!vars) {
    return str;
  }

  return str.replaceAll(/{{([\s\S]+?)}}/g, (substring: string, p1: string) => {
    const matchingVar = vars[p1] ? vars[p1] : substring;

    return matchingVar;
  });
};

export const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
