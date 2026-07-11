<script lang="ts">
  import { goto } from "$app/navigation";
  import type { HeaderOperation, RequestRule } from "$lib/client/app_context.svelte";
  import { getAppContext, ResourceType } from "$lib/client/app_context.svelte";
  import { getNextDNRId, insertRule } from "$lib/client/firestore";
  import Sidebar from "$lib/components/Sidebar/Sidebar.svelte";

  const appContext = getAppContext();

  const availableResourceTypes = Object.values(ResourceType);

  const rule = $state<RequestRule>({
    id: crypto.randomUUID(),
    dnrId: 0,
    name: "",
    type: "modifyHeaders",
    urlFilter: "",
    requestHeaders: [],
    responseHeaders: [],
    resourceTypes: [ResourceType.main_frame, ResourceType.sub_frame, ResourceType.xmlhttprequest],
    isActive: true,
  });

  let isSubmitting = $state(false);
  let errorMessage = $state("");

  function toggleResourceType(type: ResourceType, checked: boolean) {
    if (checked) {
      if (!rule.resourceTypes.includes(type)) {
        rule.resourceTypes = [...rule.resourceTypes, type];
      }
    } else {
      rule.resourceTypes = rule.resourceTypes.filter((t) => t !== type);
    }
  }

  function newHeader(): HeaderOperation {
    return { header: "", operation: "set", value: "", isActive: true };
  }

  function addHeaderRow(target: "request" | "response") {
    if (target === "request") {
      rule.requestHeaders = [...rule.requestHeaders, newHeader()];
    } else {
      rule.responseHeaders = [...rule.responseHeaders, newHeader()];
    }
  }

  function removeHeaderRow(target: "request" | "response", index: number) {
    if (target === "request") {
      rule.requestHeaders = rule.requestHeaders.filter((_, i) => i !== index);
    } else {
      rule.responseHeaders = rule.responseHeaders.filter((_, i) => i !== index);
    }
  }

  async function handleCreateRule(event: SubmitEvent) {
    event.preventDefault();

    if (!appContext.authUser?.uid) {
      errorMessage = "User ID is not available. Cannot create rule.";
      console.error(errorMessage);
      return;
    }

    if (!rule.name.trim()) {
      errorMessage = "Rule name is required.";
      return;
    }

    errorMessage = "";
    isSubmitting = true;

    try {
      await getNextDNRId(appContext.authUser.uid).then((nextId) => {
        rule.dnrId = nextId;
      });
      await insertRule(appContext.authUser.uid, rule);
      console.log("Rule created:", rule);

      goto(`#/rules/edit/${rule.id}`);
    } catch (error) {
      console.error("Failed to create rule:", error);
      errorMessage = "Failed to create rule. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="container">
  <Sidebar />

  <section>
    <div class="page-header">
      <div class="page-header-left">
        <a href="#/" class="btn btn-secondary btn-icon" aria-label="Go back"> ← </a>
        <h1>Create rule</h1>
      </div>

      <div class="page-header-actions">
        <button type="submit" form="rule-form" class="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Rule"}
        </button>
      </div>
    </div>

    <form id="rule-form" onsubmit={handleCreateRule}>
      <div class="form-row">
        <div class="form-group">
          <label for="rule-id">ID</label>
          <input type="text" id="rule-id" defaultValue={rule.id} required disabled />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={rule.isActive} />
            Enabled
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="rule-name">Rule Name</label>
        <input
          type="text"
          id="rule-name"
          bind:value={rule.name}
          placeholder="e.g., Redirect Mock API, Block Analytics..."
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="rule-type">Action Type</label>
          <select id="rule-type" bind:value={rule.type}>
            <option value="modifyHeaders">Modify Headers</option>
            <option value="block">Block Request</option>
            <option value="redirect">Redirect Request</option>
          </select>
        </div>

        <div class="form-group">
          <label for="url-filter">URL Filter pattern</label>
          <input type="text" id="url-filter" bind:value={rule.urlFilter} placeholder="e.g., *://*.doubleclick.net/*" />
        </div>
      </div>

      <div class="form-group">
        <span class="group-label">Resource Types to Match</span>
        <div class="checkbox-grid">
          {#each availableResourceTypes as type}
            <label class="checkbox-label">
              <input
                type="checkbox"
                value={type}
                checked={rule.resourceTypes.includes(type)}
                onchange={(e) => toggleResourceType(type, e.currentTarget.checked)}
              />
              {type}
            </label>
          {/each}
        </div>
      </div>

      {#if rule.type === "redirect"}
        <div class="form-group">
          <label for="redirect-url">Redirect Target URL</label>
          <input
            type="text"
            id="redirect-url"
            bind:value={rule.redirectUrl}
            placeholder="https://example.com/mock.json"
          />
        </div>
      {/if}

      {#if rule.type === "modifyHeaders"}
        <div class="headers-config">
          <h3 class="headers-section-title">Request Headers</h3>
          {#each rule.requestHeaders as h, i (i)}
            <div class="header-row">
              <input
                type="checkbox"
                checked={h.isActive !== false}
                onchange={(e) => (h.isActive = e.currentTarget.checked)}
                aria-label="Toggle request header active"
              />
              <input
                type="text"
                placeholder="Header Name (e.g., User-Agent)"
                bind:value={h.header}
                aria-label="Request Header Name"
                disabled={h.isActive === false}
              />
              <select bind:value={h.operation} aria-label="Operation" disabled={h.isActive === false}>
                <option value="set">Set / Overwrite</option>
                <option value="append">Append</option>
                <option value="remove">Remove</option>
              </select>
              {#if h.operation !== "remove"}
                <input
                  type="text"
                  placeholder="Value"
                  bind:value={h.value}
                  aria-label="Value"
                  disabled={h.isActive === false}
                />
              {:else}
                <div></div>
              {/if}
              <button
                type="button"
                class="btn-danger"
                onclick={() => removeHeaderRow("request", i)}
                aria-label="Remove header row">✕</button
              >
            </div>
          {/each}
          <button type="button" class="btn-secondary" onclick={() => addHeaderRow("request")}
            >+ Add Request Header</button
          >

          <h3 class="headers-section-title">Response Headers</h3>
          {#each rule.responseHeaders as h, i (i)}
            <div class="header-row">
              <input
                type="checkbox"
                checked={h.isActive !== false}
                onchange={(e) => (h.isActive = e.currentTarget.checked)}
                aria-label="Toggle response header active"
              />
              <input
                type="text"
                placeholder="Header Name (e.g., Content-Type)"
                bind:value={h.header}
                aria-label="Response Header Name"
                disabled={h.isActive === false}
              />
              <select bind:value={h.operation} aria-label="Operation" disabled={h.isActive === false}>
                <option value="set">Set / Overwrite</option>
                <option value="append">Append</option>
                <option value="remove">Remove</option>
              </select>
              {#if h.operation !== "remove"}
                <input
                  type="text"
                  placeholder="Value"
                  bind:value={h.value}
                  aria-label="Value"
                  disabled={h.isActive === false}
                />
              {:else}
                <div></div>
              {/if}
              <button
                type="button"
                class="btn-danger"
                onclick={() => removeHeaderRow("response", i)}
                aria-label="Remove header row">✕</button
              >
            </div>
          {/each}
          <button type="button" class="btn-secondary" onclick={() => addHeaderRow("response")}
            >+ Add Response Header</button
          >
        </div>
      {/if}

      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}
    </form>
  </section>
</div>
