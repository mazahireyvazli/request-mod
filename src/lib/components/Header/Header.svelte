<script lang="ts">
  import svgLoader from "$lib/assets/svg/loader.svg";
  import { getAppContext } from "$lib/client/app_context.svelte";
  import ColorSchemeSelect from "$lib/components/ColorSchemeSelect/ColorSchemeSelect.svelte";
  import SettingsMenu from "$lib/components/SettingsMenu/SettingsMenu.svelte";

  const appContext = getAppContext();

  const available_statuses = [
    {
      name: "Updating",
      loader: true,
    },
    {
      name: "Connected",
    },
  ];

  let status = $state(available_statuses[0]);

  let updating = $state(false);
  let checking_update = $state(false);

  $effect(() => {
    if (appContext.isInteractive) {
      status = available_statuses[1];
    }
  });
</script>

<header>
  <div class="header-inner">
    <div class="header-left">
      <a href="#/" class="logo">Request Modifier Pro</a>

      <div class="header-status">
        Status: {status.name}
        {#if status.loader}
          <div class="header-status-loader">
            <img src={svgLoader} alt="loader" width="22" height="22" />
          </div>
        {/if}

        {#if !appContext.isExtension}
          {#if appContext.isUpdateAvailable}
            <button
              class="update-button"
              onclick={async () => {
                updating = true;
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration?.waiting) {
                  registration.waiting.postMessage({ type: "SKIP_WAITING" });
                  return;
                }

                updating = false;
              }}
            >
              {#if updating}
                <img src={svgLoader} alt="loader" width="16" height="16" />
              {/if}
              Update
            </button>
          {:else}
            <button
              class="update-button"
              disabled={checking_update}
              onclick={async () => {
                checking_update = true;
                const registration = await navigator.serviceWorker.getRegistration();
                await registration?.update();

                if (registration?.waiting) {
                  appContext.isUpdateAvailable = true;
                }

                checking_update = false;
              }}
            >
              Check updates
            </button>
          {/if}
        {/if}
      </div>
    </div>

    <div class="header-right">
      {#if appContext.isExtension}
        <button
          class="icon-btn"
          title="Open extension in full tab"
          aria-label="Open extension in full tab"
          onclick={() => {
            chrome?.tabs?.create({ url: document.URL });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
            width="18"
            height="18"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </button>
      {/if}
      <ColorSchemeSelect />
      <SettingsMenu />
    </div>
  </div>
</header>

<style>
  :root {
    --header-height: 3.5rem;
  }
  header {
    border-bottom: 1px solid light-dark(#e0e0e0, #2a2a2a);
    height: var(--header-height);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .logo {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-theme-primary, inherit);
    white-space: nowrap;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-status {
    font-size: 0.8125rem;
    color: light-dark(#666, #aaa);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 1.25rem;
    border-left: 1px solid light-dark(#e0e0e0, #333);
  }

  .header-status-loader {
    display: flex;
  }

  .update-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: none;
    background: none;
    color: inherit;
    font-size: 0.8125rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  .update-button:hover:not(:disabled) {
    color: var(--color-theme-primary, #000);
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0.375rem;
    color: var(--text-color);
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s;
  }

  .icon-btn:hover {
    background-color: light-dark(#f0f0f0, #2a2a2a);
  }
</style>
