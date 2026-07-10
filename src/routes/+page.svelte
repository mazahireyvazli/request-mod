<script lang="ts">
  import { getAppContext } from "$lib/client/app_context.svelte";
  import { deleteRuleById, updateRuleById } from "$lib/client/firestore";
  import Sidebar from "$lib/components/Sidebar/Sidebar.svelte";

  const appContext = getAppContext();
  const userId = appContext.authUser?.uid;

  async function handleToggleRuleActive(ruleId: string, isActive: boolean) {
    if (!userId) {
      console.error("User ID is not available. Cannot toggle rule active state.");
      return;
    }

    await updateRuleById(userId, ruleId, { isActive });
  }

  async function handleToggleHeaderActive(ruleId: string, headerType: "request" | "response", headerIndex: number) {
    if (!userId) {
      console.error("User ID is not available. Cannot toggle rule active state.");
      return;
    }

    const rule = appContext.rules?.find((r) => r.id === ruleId);
    if (!rule) {
      console.error(`Rule with ID ${ruleId} not found.`);
      return;
    }
    const headers = headerType === "request" ? rule.requestHeaders : rule.responseHeaders;
    if (!headers || headerIndex < 0 || headerIndex >= headers.length) {
      console.error(`Header index ${headerIndex} is out of bounds for rule ${ruleId}.`);
      return;
    }
    const header = headers[headerIndex];
    const newIsActive = header.isActive === false ? true : false;
    await updateRuleById(userId, ruleId, {
      [headerType === "request" ? "requestHeaders" : "responseHeaders"]: headers.map((h, idx) =>
        idx === headerIndex ? { ...h, isActive: newIsActive } : h,
      ),
    });
  }

  async function handleDeleteRule(ruleId: string) {
    if (!confirm("Are you sure you want to delete this rule? This action cannot be undone.")) {
      return;
    }
    if (!userId) {
      console.error("User ID is not available. Cannot delete rule.");
      return;
    }

    try {
      await deleteRuleById(userId, ruleId);
    } catch (error) {
      console.error(`Failed to delete rule with ID ${ruleId}:`, error);
    }
  }
</script>

<div class="container">
  <Sidebar />

  <section class="rules-dashboard">
    <div class="dashboard-header">
      <h2>Rules ({appContext.rules?.length})</h2>
      <a href="#/rules/create" class="btn btn-success">+ New Rule</a>
    </div>

    {#if !appContext.rules || appContext.rules.length === 0}
      <div class="card empty-state">
        <p>No request modification rules found. Click "+ New Rule" to create your first rule!</p>
      </div>
    {:else}
      <div class="rules-list">
        {#each appContext.rules as rule (rule.id)}
          <div class="card rule-item" class:inactive={!rule.isActive}>
            <div class="rule-status-toggle">
              <input
                type="checkbox"
                id="toggle-{rule.id}"
                checked={rule.isActive}
                onchange={(event) => {
                  const target = event.target as HTMLInputElement;
                  handleToggleRuleActive(rule.id, target.checked);
                }}
                aria-label="Toggle rule active"
              />
            </div>
            <div class="rule-details">
              <div class="rule-title-row">
                <span class="rule-name">{rule.name}</span>
                <span class="badge badge-type badge-{rule.type}">{rule.type}</span>
              </div>
              <div class="rule-meta">
                <span class="meta-label">Matches:</span> <code>{rule.urlFilter || "*"}</code>
              </div>
              {#if rule.type === "redirect"}
                <div class="rule-meta">
                  <span class="meta-label">Redirect to:</span> <code>{rule.redirectUrl}</code>
                </div>
              {:else if rule.type === "modifyHeaders"}
                {#if rule.requestHeaders && rule.requestHeaders.length > 0}
                  <div class="header-pills">
                    <span class="meta-label">Request:</span>
                    {#each rule.requestHeaders as h, hIdx}
                      <span
                        class="pill clickable-pill"
                        class:pill-disabled={h.isActive === false}
                        onclick={() => {
                          handleToggleHeaderActive(rule.id, "request", hIdx);
                        }}
                        role="button"
                        tabindex="0"
                        onkeydown={(e) => e.key === "Enter" && handleToggleHeaderActive(rule.id, "request", hIdx)}
                      >
                        <span class="pill-dot" class:pill-dot-active={h.isActive !== false}></span>
                        <strong style="color: var(--primary-color);">{h.operation}</strong>
                        {h.header}: <span class="pill-value">{h.value}</span>
                      </span>
                    {/each}
                  </div>
                {/if}
                {#if rule.responseHeaders && rule.responseHeaders.length > 0}
                  <div class="header-pills">
                    <span class="meta-label">Response:</span>
                    {#each rule.responseHeaders as h, hIdx}
                      <span
                        class="pill clickable-pill"
                        class:pill-disabled={h.isActive === false}
                        onclick={() => handleToggleHeaderActive(rule.id, "response", hIdx)}
                        role="button"
                        tabindex="0"
                        onkeydown={(e) => e.key === "Enter" && handleToggleHeaderActive(rule.id, "response", hIdx)}
                      >
                        <span class="pill-dot" class:pill-dot-active={h.isActive !== false}></span>
                        <strong style="color: var(--success-color);">{h.operation}</strong>
                        {h.header}: <span class="pill-value">{h.value}</span>
                      </span>
                    {/each}
                  </div>
                {/if}
              {/if}
            </div>
            <div class="rule-actions">
              <a class="btn btn-sm btn-secondary" href="#/rules/edit/{rule.id}" aria-label="Edit rule">Edit</a>
              <button onclick={() => handleDeleteRule(rule.id)} class="btn btn-sm btn-danger" aria-label="Delete rule"
                >Delete</button
              >
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
