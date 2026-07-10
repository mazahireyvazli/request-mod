import type { User } from "firebase/auth";

import { getContext, setContext } from "svelte";

export enum ResourceType {
  "main_frame" = "main_frame",
  "sub_frame" = "sub_frame",
  "stylesheet" = "stylesheet",
  "script" = "script",
  "image" = "image",
  "font" = "font",
  "xmlhttprequest" = "xmlhttprequest",
  "websocket" = "websocket",
  "other" = "other",
}

export interface HeaderOperation {
  header: string;
  operation: "set" | "remove" | "append";
  value?: string;
  isActive?: boolean; // Optional, defaults to true
}

export interface RequestRule {
  id: string;
  dnrId: number; // Integer between 1 and 30000
  name: string;
  type: "block" | "redirect" | "modifyHeaders";
  urlFilter: string;
  resourceTypes: ResourceType[];
  requestHeaders: HeaderOperation[];
  responseHeaders: HeaderOperation[];
  redirectUrl?: string;
  isActive: boolean;
}

export interface DBUser {
  email: string;
  isExtensionEnabled: boolean;
}

class AppContext {
  isInteractive = $state(false);
  isUpdateAvailable = $state(false);

  authUser = $state<User | null>();
  dbUser = $state<DBUser | null>();

  rules = $state<RequestRule[]>();

  get isExtension() {
    return !!(chrome?.runtime?.id && chrome?.identity);
  }
  get isExtensionPopup() {
    return !!chrome?.extension?.getViews({ type: "popup" })?.length;
  }
}

const APP_CONTEXT_KEY = Symbol("APP_CONTEXT");

export function setAppContext() {
  return setContext(APP_CONTEXT_KEY, new AppContext());
}

export function getAppContext() {
  return getContext<AppContext>(APP_CONTEXT_KEY);
}
