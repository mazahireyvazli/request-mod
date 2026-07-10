import type { RequestRule } from "$lib/client/app_context.svelte";

export async function updateExtensionDNRRules(rules: RequestRule[]) {
  if (!chrome?.runtime) {
    window.postMessage(
      {
        type: "UPDATE_DNR_RULES",
        rules,
      },
      "*",
    );
  }

  chrome?.runtime?.sendMessage({ type: "UPDATE_DNR_RULES", rules }, (response) => {
    if (response && response.success) {
      console.log("DNR rules updated successfully.", response);
    } else {
      console.error("Failed to update DNR rules:", response);
    }
  });
}

export async function removeAllDNRRules() {
  if (!chrome?.runtime) {
    window.postMessage(
      {
        type: "REMOVE_ALL_DNR_RULES",
      },
      "*",
    );
  }

  chrome?.runtime?.sendMessage({ type: "REMOVE_ALL_DNR_RULES" }, (response) => {
    if (response && response.success) {
      console.log("All DNR rules removed successfully.", response);
    } else {
      console.error("Failed to remove all DNR rules:", response);
    }
  });
}
