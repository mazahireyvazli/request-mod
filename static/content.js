// Run this inside your extension's content script
window.addEventListener("message", (event) => {
  // Security check: Only accept messages from the same page context
  if (event.source !== window) return;

  // Filter and check for your specific payload identifier
  if (event.data && event.data.type === "UPDATE_DNR_RULES") {
    void updateExtensionDNRRules(event.data.rules);
  }

  if (event.data && event.data.type === "REMOVE_ALL_DNR_RULES") {
    void removeAllDNRRules();
  }
});

/**
 * @param {import("$lib/client/app_context.svelte").RequestRule[]} rules
 */
async function updateExtensionDNRRules(rules) {
  chrome?.runtime?.sendMessage({ type: "UPDATE_DNR_RULES", rules }, (response) => {
    if (response && response.success) {
      console.log("DNR rules updated successfully.", response);
    } else {
      console.error("Failed to update DNR rules:", response);
    }
  });
}

async function removeAllDNRRules() {
  chrome?.runtime?.sendMessage({ type: "REMOVE_ALL_DNR_RULES" }, (response) => {
    if (response && response.success) {
      console.log("All DNR rules removed successfully.", response);
    } else {
      console.error("Failed to remove all DNR rules:", response);
    }
  });
}
