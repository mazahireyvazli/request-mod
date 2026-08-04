<script lang="ts">
  import { getAppContext } from "$lib/client/app_context.svelte";
  import { auth } from "$lib/client/firebase";
  import { storeExtensionEnabled } from "$lib/client/firestore";

  const appContext = getAppContext();
  let dropdownRef: HTMLDivElement | null = null;

  async function toggleExtension(e: Event) {
    if (!appContext.authUser) {
      console.error("No authenticated user found.");
      return;
    }

    const target = e.target as HTMLInputElement;
    const isEnabled = target.checked;

    storeExtensionEnabled(appContext.authUser?.uid, isEnabled);
  }

  async function handleSignOut() {
    if (auth) {
      await auth.signOut();
    }
    dropdownRef?.hidePopover();
  }
</script>

<div class="settings-select">
  <button class="settings-select__toggle" popovertarget="settings-dropdown" aria-label="Settings">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      width="20"
      height="20"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </svg>
  </button>
  <div
    class="settings-select__dropdown"
    bind:this={dropdownRef}
    id="settings-dropdown"
    popover="auto"
    role="menu"
    aria-label="Settings options"
  >
    <div class="settings-select__option" role="menuitem" style="display: flex; justify-content: space-between;">
      <span style="display: flex; align-items: center; gap: 0.5rem;"> Enable Extension </span>
      <label class="switch">
        <input type="checkbox" checked={appContext.dbUser?.isExtensionEnabled} onchange={toggleExtension} />
        <span class="slider round"></span>
      </label>
    </div>
    <button class="settings-select__option" role="menuitem" onclick={handleSignOut} style="width: 100%;">
      <span style="display: flex; align-items: center; justify-content: center;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          width="16"
          height="16"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </span>
      <span>Sign out</span>
    </button>
  </div>
</div>

<style>
  .settings-select {
    position: relative;
  }

  .settings-select__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0.375rem;
    color: var(--text-color);
    cursor: pointer;
    border-radius: 8px;
  }

  .settings-select__toggle:hover {
    background-color: light-dark(#f0f0f0, #2a2a2a);
  }

  .settings-select__dropdown {
    position: absolute;
    inset: unset;
    position-area: bottom span-left;
    margin: 0;
    margin-top: 0.25rem;
    min-width: 12rem;
    padding: 0;
    background-color: var(--bg-color);
    border: 1px solid light-dark(#e0e0e0, #333);
    border-radius: 8px;
    box-shadow: 0 4px 12px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.3));
    overflow: hidden;
  }

  .settings-select__dropdown::backdrop {
    background: transparent;
  }

  .settings-select__option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    font-family: inherit;
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    text-align: left;
  }

  .settings-select__option:hover {
    background-color: light-dark(#f0f0f0, #2a2a2a);
  }

  /* Toggle Switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color, #ccc);
    transition: 0.3s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--success-color, #10b981);
  }

  input:checked + .slider:before {
    transform: translateX(16px);
  }
</style>
