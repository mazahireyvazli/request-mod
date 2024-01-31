import { RuleAppModel } from "../storage/rule.storage";
import { EnvironmentAppModel, getVarsKV } from "../storage/environment.storage";
import { getCompiledValue, hashCode } from "../utils/common";
import { MSG_ACTION, Msg } from "../types/message";

export const applyRules = async (
  rules: RuleAppModel[],
  activeEnv?: EnvironmentAppModel,
) => {
  const activeEnvVars = getVarsKV(activeEnv?.vars);

  const applyRules: chrome.declarativeNetRequest.Rule[] = rules
    .filter(
      (rule) =>
        rule.active === true &&
        rule.rule.action.requestHeaders.filter(
          (header) => header.active === true && header.header,
        ).length > 0,
    )
    .map(
      (rule): chrome.declarativeNetRequest.Rule => ({
        id: hashCode(rule.document_id!),
        priority: rule.rule.priority,
        action: {
          type: rule.rule.action.type,
          requestHeaders: rule.rule.action.requestHeaders
            .filter((header) => header.active === true && header.header)
            .map((header) => ({
              operation: header.operation,
              header: getCompiledValue(header.header, activeEnvVars),
              value: getCompiledValue(header.value, activeEnvVars),
            })),
        },
        condition: {
          urlFilter: rule.rule.condition.urlFilter,
          resourceTypes: Object.values(
            chrome.declarativeNetRequest.ResourceType,
          ),
        },
      }),
    );

  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map((rule) => rule.id);

  console.log("clearing rules", oldRules);
  console.log("applying rules", applyRules);

  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: applyRules,
  });
};

chrome.runtime.onMessage.addListener((msg?: Msg) => {
  console.log("msg received", msg);

  switch (msg?.action) {
    case MSG_ACTION.APPLY_RULES:
      applyRules(msg.rules, msg.activeEnv);
      break;

    case MSG_ACTION.DISABLE_EXTENSION:
      applyRules([]);
      break;

    case MSG_ACTION.ENABLE_EXTENSION:
      applyRules(msg.rules, msg.activeEnv);
      break;

    default:
      break;
  }
});
