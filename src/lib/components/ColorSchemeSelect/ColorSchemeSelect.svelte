<script lang="ts">
  import darkLightModeSVG from "$lib/assets/svg/dark_light_mode.svg?raw";
  import darkModeSVG from "$lib/assets/svg/dark_mode.svg?raw";
  import lightModeSVG from "$lib/assets/svg/light_mode.svg?raw";
  import { PersistedState } from "$lib/utils/persisted-state";

  const options: { value: ColorScheme; label: string; icon: string }[] = [
    { value: "light", label: "Light", icon: lightModeSVG },
    { value: "dark", label: "Dark", icon: darkModeSVG },
    { value: "default", label: "System", icon: darkLightModeSVG },
  ];

  const colorScheme = new PersistedState<ColorScheme>("colorScheme", "default");
  $effect(() => {
    globalThis.colorScheme.apply(colorScheme.value);
  });

  let dropdownRef: HTMLDivElement | null = null;

  let currentIcon = $derived(options.find((o) => o.value === colorScheme.value)?.icon ?? options[2]!.icon);

  function handleSelect(value: ColorScheme) {
    colorScheme.value = value;
    dropdownRef?.hidePopover();
  }
</script>

<div class="cs-select">
  <button class="cs-select__toggle" popovertarget="cs-dropdown" aria-label="Change color scheme">
    <span style="width:16px;height:16px" bind:innerHTML={currentIcon} contenteditable="false"></span>
  </button>
  <div
    class="cs-select__dropdown"
    bind:this={dropdownRef}
    id="cs-dropdown"
    popover="auto"
    role="listbox"
    aria-label="Color scheme options"
  >
    {#each options as option}
      <button
        class="cs-select__option"
        class:cs-select__option--active={colorScheme.value === option.value}
        role="option"
        aria-selected={colorScheme.value === option.value}
        onclick={() => handleSelect(option.value)}
      >
        <span style="width:16px;height:16px">{@html option.icon}</span>
        <span>{option.label}</span>
        <span class="cs-select__option-check">{colorScheme.value === option.value ? "✓" : ""}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .cs-select {
    position: relative;
  }

  .cs-select__toggle {
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

  .cs-select__toggle:hover {
    opacity: 0.7;
  }

  .cs-select__dropdown {
    position: absolute;
    inset: unset;
    position-area: bottom span-left;
    margin: 0;
    margin-top: 0.25rem;
    min-width: 8.5rem;
    padding: 0;
    background-color: var(--bg-color);
    border: 1px solid light-dark(#e0e0e0, #333);
    border-radius: 8px;
    box-shadow: 0 4px 12px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.3));
    overflow: hidden;
  }

  .cs-select__dropdown::backdrop {
    background: transparent;
  }

  .cs-select__option {
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

  .cs-select__option:hover {
    background-color: light-dark(#f0f0f0, #2a2a2a);
  }

  .cs-select__option--active {
    font-weight: 600;
  }

  .cs-select__option-check {
    width: 1rem;
    text-align: center;
    font-size: 0.75rem;
  }
</style>
