chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("background script received message:", request);
  if (request.type === "UPDATE_DNR_RULES") {
    const response = await updateDNRRules(request.rules);
    sendResponse(response);
  }
  if (request.type === "REMOVE_ALL_DNR_RULES") {
    const response = await removeAllDNRRules();
    sendResponse(response);
  }
});

/**
 * @param {import("$lib/client/app_context.svelte").RequestRule[]} rules
 */
async function updateDNRRules(rules) {
  try {
    const existingDnrRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existingDnrRules.map((r) => r.id);

    const rulesToRegister = rules.map((r) => convertToDnrRule(r)).filter((r) => r !== null);

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: rulesToRegister,
    });

    return {
      success: true,
      registeredRuleIds: rulesToRegister.map((r) => r.id),
      removedRuleIds: existingIds,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

async function removeAllDNRRules() {
  try {
    const existingDnrRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existingDnrRules.map((r) => r.id);

    if (existingIds.length === 0) {
      return { success: true, removedRuleIds: [], addedRuleIds: [] };
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: [],
    });

    return {
      success: true,
      removedRuleIds: existingIds,
      addedRuleIds: [],
    };
  } catch (error) {
    return {
      error,
    };
  }
}

/**
 * @param {import("$lib/client/app_context.svelte").RequestRule} rule
 */
function convertToDnrRule(rule) {
  // Convert Proxy arrays / reactive bindings back to a clean array
  const resourceTypes =
    rule.resourceTypes && Array.isArray(rule.resourceTypes)
      ? Array.from(rule.resourceTypes)
      : ["main_frame", "sub_frame", "xmlhttprequest"];

  const dnrRule = {
    id: rule.dnrId,
    priority: 1,
    condition: {
      urlFilter: rule.urlFilter || "*",
      resourceTypes: resourceTypes.length > 0 ? resourceTypes : ["main_frame", "sub_frame", "xmlhttprequest"],
    },
  };

  if (rule.type === "block") {
    dnrRule.action = { type: "block" };
  } else if (rule.type === "redirect") {
    dnrRule.action = {
      type: "redirect",
      redirect: { url: rule.redirectUrl || "" },
    };
  } else if (rule.type === "modifyHeaders") {
    const action = { type: "modifyHeaders" };
    let hasHeaders = false;

    if (rule.requestHeaders && rule.requestHeaders.length > 0) {
      // Clean request headers from proxy wrappers and skip disabled headers
      const cleanRequestHeaders = Array.from(rule.requestHeaders);
      const activeRequestHeaders = cleanRequestHeaders
        .filter((h) => h.isActive !== false)
        .map((h) => ({
          header: h.header,
          operation: h.operation,
          ...(h.operation !== "remove" ? { value: h.value || "" } : {}),
        }));

      if (activeRequestHeaders.length > 0) {
        action.requestHeaders = activeRequestHeaders;
        hasHeaders = true;
      }
    }

    if (rule.responseHeaders && rule.responseHeaders.length > 0) {
      // Clean response headers from proxy wrappers and skip disabled headers
      const cleanResponseHeaders = Array.from(rule.responseHeaders);
      const activeResponseHeaders = cleanResponseHeaders
        .filter((h) => h.isActive !== false)
        .map((h) => ({
          header: h.header,
          operation: h.operation,
          ...(h.operation !== "remove" ? { value: h.value || "" } : {}),
        }));

      if (activeResponseHeaders.length > 0) {
        action.responseHeaders = activeResponseHeaders;
        hasHeaders = true;
      }
    }

    // Chrome DNR rules of type 'modifyHeaders' MUST contain at least one valid/enabled request or response header operation.
    // If all headers are disabled, fall back to registering nothing for this rule's action.
    if (hasHeaders) {
      dnrRule.action = action;
    } else {
      // Return null to signify this rule shouldn't be loaded into Chrome DNR because it is empty
      return null;
    }
  }

  return dnrRule;
}
