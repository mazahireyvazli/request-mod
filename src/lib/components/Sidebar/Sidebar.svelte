<script lang="ts">
  import { getAppContext } from "$lib/client/app_context.svelte";
  import { auth } from "$lib/client/firebase";
  import { storeExtensionEnabled } from "$lib/client/firestore";
  import { signOut } from "firebase/auth";


  const appContext = getAppContext();
  const currentUser = appContext.authUser;
  const userId = appContext.authUser?.uid;


  async function handleSignOut() {
    if (!auth) return;
    try {
      await signOut(auth);
      appContext.authUser = null;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggleExtensionEnabled(event: Event) {
    if (!userId) {
      console.error("User ID is not available. Cannot toggle extension state.");
      return;
    }

    const target = event.target as HTMLInputElement;
    const isEnabled = target.checked;

    await storeExtensionEnabled(userId, isEnabled);
  }

</script>
<aside class="auth-section">
    {#if currentUser}
      <div class="card success">
        <div class="avatar-container">
          {#if currentUser.photoURL}
            <img class="avatar" src={currentUser.photoURL} alt={currentUser.displayName || "Avatar"} />
          {:else}
            <div class="avatar-placeholder">{currentUser.email?.charAt(0).toUpperCase()}</div>
          {/if}
          <div class="user-meta">
            <span class="user-title">Cloud Account</span>
            <span class="user-email" title={currentUser.email}>{currentUser.email}</span>
          </div>
        </div>
        <button
          class="btn btn-danger btn-sm"
          onclick={handleSignOut}
          style="width: 100%; margin-top: 1rem; border-radius: 6px;">Sign Out</button
        >
      </div>
    {/if}

    <div class="card mode-badge">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <h3 style="margin: 0;">Connection</h3>
        <label
          class="switch"
          title="Toggle entire extension enable/disable state"
          aria-label="Toggle entire extension globally"
        >
          <input
            type="checkbox"
            checked={appContext.dbUser?.isExtensionEnabled}
            onchange={handleToggleExtensionEnabled}
          />
          <span class="slider round"></span>
        </label>
      </div>
      {#if appContext.isExtension}
        {#if appContext.dbUser?.isExtensionEnabled}
          <div class="status-indicator">
            <span class="pulse-dot pulse-success"></span>
            <span class="badge-text" style="color: var(--success-color); font-weight: 600;">Extension Active</span>
          </div>
          <p class="mode-desc">Modifications are being actively applied to outgoing HTTP requests.</p>
        {:else}
          <div class="status-indicator">
            <span
              class="pulse-dot pulse-danger"
              style="background-color: var(--danger-color); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);"
            ></span>
            <span class="badge-text" style="color: var(--danger-color); font-weight: 600;">Extension Paused</span>
          </div>
          <p class="mode-desc">Rules are temporarily suspended because the extension is disabled globally.</p>
        {/if}
      {:else}
        <div class="status-indicator">
          <span class="pulse-dot pulse-warning"></span>
          <span class="badge-text" style="color: var(--warning-color); font-weight: 600;">Dashboard Mode</span>
        </div>
        <p class="mode-desc">Sync and manage rules here. Install the extension to modify request traffic.</p>
      {/if}
    </div>
  </aside>