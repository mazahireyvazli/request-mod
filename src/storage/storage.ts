import { firestore } from "../firebase/init";
import { storageExtensionDisabledKey } from "../utils/common";
import { EnvironmentStorage } from "./environment.storage";
import { RuleStorage } from "./rule.storage";
import { UserStorage } from "./user.storage";

export const userStorage = new UserStorage(firestore);
export const ruleStorage = new RuleStorage(firestore);
export const environmentStorage = new EnvironmentStorage(firestore);

export const globalStorage = {
  isExtensionDisabled: () => {
    const val = localStorage.getItem(storageExtensionDisabledKey);

    if (val && val === "true") {
      return true;
    }

    return false;
  },
  setIsExtensionDisabled: (v: boolean) => {
    localStorage.setItem(storageExtensionDisabledKey, v.toString());
  },
  isExtensionOpenInPopup: () => {
    return !!chrome?.extension?.getViews({ type: "popup" })?.length;
  },
};
