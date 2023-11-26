import { RuleSet } from "../models/rule";

export const applyRules = async () => {
  const ruleset = await RuleSet.getInstance().getRules();

  const rules: chrome.declarativeNetRequest.Rule[] = ruleset
    .filter(
      (rule) =>
        rule.active === true &&
        rule.headers.filter((header) => header.active === true && header.name)
          .length > 0,
    )
    .map((rule) => ({
      id: rule.id,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        requestHeaders: rule.headers
          .filter((header) => header.active === true)
          .map((header) => ({
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            header: header.name,
            value: header.value,
          })),
      },
      condition: {
        urlFilter: rule.urlPattern,
        resourceTypes: Object.values(chrome.declarativeNetRequest.ResourceType),
      },
    }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleset.map((rule) => rule.id),
    addRules: rules,
  });
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("setting initial rules");
  applyRules();
});
chrome.runtime.onMessage.addListener((msg) => {
  if (msg === "applyRules") {
    console.log("applyRules msg received");
    applyRules();
  }
});

chrome.storage.sync.onChanged.addListener(() => {
  console.log("updating rules");
  applyRules();
});
