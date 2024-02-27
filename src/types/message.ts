import { EnvironmentAppModel } from "../storage/environment.storage";
import { RuleAppModel } from "../storage/rule.storage";

export type Msg = {
  rules: RuleAppModel[];
  activeEnv?: EnvironmentAppModel;
  action: MSG_ACTION;
};

export enum MSG_ACTION {
  APPLY_RULES = "APPLY_RULES",
  ENABLE_EXTENSION = "ENABLE_EXTENSION",
  DISABLE_EXTENSION = "DISABLE_EXTENSION",
}
