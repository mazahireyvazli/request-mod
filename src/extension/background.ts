import { RuleSet } from "../models/rule";

export const applyRules = async () => {
  const ruleset = await RuleSet.getInstance().getRules();

  const rules: chrome.declarativeNetRequest.Rule[] = ruleset.map((rule) => ({
    id: rule.id,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: rule.headers.map((header) => ({
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        header: header.name,
        value: header.value,
      })),
    },
    condition: {
      regexFilter: rule.urlPattern,
      resourceTypes: Object.values(chrome.declarativeNetRequest.ResourceType),
    },
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((rule) => rule.id),
    addRules: rules,
  });
};

applyRules();

setInterval(() => {
  console.log("updating rules");
  applyRules();
}, 5 * 1000);
