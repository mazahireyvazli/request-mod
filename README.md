# Request Modifier Pro

A Chrome extension **and** companion web app for modifying HTTP requests. Create rules to
**modify request/response headers**, **block**, or **redirect** requests, and have them sync
across all your devices through Firebase.

The same SvelteKit application powers both the extension popup and the standalone website, so
you can manage your rules from either place and they stay in sync in real time.

## Features

- **Modify headers** — set, append, or remove request and response headers.
- **Block requests** — stop requests that match a URL filter.
- **Redirect requests** — send matching requests to a different URL (handy for mocking APIs).
- **Resource-type targeting** — scope each rule to `main_frame`, `sub_frame`, `xmlhttprequest`,
  `script`, `image`, and more.
- **Per-rule and per-header toggles** — enable/disable an entire rule or individual header operations.
- **Cross-device sync** — rules are stored per user in Firestore and streamed live to every session.
- **Edit anywhere** — change rules from the website without opening the extension; updates are applied
  in the background automatically.
- **Google sign-in** — authentication via Firebase Auth (Chrome `identity` in the extension).

## How it works

Rules live in Firestore and are the single source of truth. The web app subscribes to them in real
time and pushes changes down to the browser's [declarativeNetRequest (DNR)][dnr] engine.

Because `chrome.declarativeNetRequest` can only be called from an extension context, updates made on
the **website** are relayed to the extension through a small messaging bridge:

```
Firestore ──(onSnapshot)──▶ Web app (+layout.svelte)
                                  │  window.postMessage
                                  ▼
                          content.js (content script)
                                  │  chrome.runtime.sendMessage
                                  ▼
                        background.js (service worker)
                                  │  chrome.declarativeNetRequest
                                  ▼
                          Dynamic DNR rules applied
```

- `src/routes/+layout.svelte` — subscribes to the user's rules and posts `UPDATE_DNR_RULES` /
  `REMOVE_ALL_DNR_RULES` messages to the page.
- `static/content.js` — content script that receives page messages and forwards them to the
  background service worker.
- `static/background.js` — service worker that converts rules to the DNR format and calls
  `chrome.declarativeNetRequest.updateDynamicRules`.
- `src/lib/client/rules_manager.ts` — the same conversion logic, used when running inside the
  extension popup directly.

Inside the extension popup the DNR APIs are available directly, so no messaging round-trip is needed.

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) 2 + [Svelte](https://svelte.dev) 5 (runes mode)
- [Firebase](https://firebase.google.com/) — Auth + Firestore
- Chrome Extension **Manifest V3** (`declarativeNetRequest`, service worker, content script)
- [Bun](https://bun.sh/) as the package manager and runtime
- [Vite](https://vite.dev/) build, [`@sveltejs/adapter-static`](https://svelte.dev/docs/kit/adapter-static)
  (fully prerendered, hash-based routing)
- [oxlint](https://oxc.rs/) + [oxfmt](https://oxc.rs/) for linting and formatting

## Project structure

```
src/
  routes/
    +layout.svelte           App shell, auth + Firestore subscription, DNR bridge
    +page.svelte             Rules dashboard
    rules/create/            Create-rule page
    rules/edit/[id]/         Edit-rule page
  lib/
    client/
      firebase.ts            Firebase app/init
      firestore.ts           Firestore CRUD for rules
      app_context.svelte.ts  Shared app state + RequestRule / HeaderOperation types
      rules_manager.ts       RequestRule → DNR conversion (extension context)
    components/              Header, Sidebar, LoginModal, settings, etc.
  sw.ts                      PWA cache service worker (web app only)
static/
  manifest.json             MV3 extension manifest
  background.js             Extension service worker (DNR updates)
  content.js               Content script (page ↔ background bridge)
```

## Getting started

### Prerequisites

- [Bun](https://bun.sh/)
- A Firebase project with **Authentication** (Google provider) and **Firestore** enabled

### Setup

Create a `.env` with your Firebase web config (keys are exposed to the client and use the
`PUBLIC_` prefix):

```sh
PUBLIC_FIREBASE_API_KEY=...
PUBLIC_FIREBASE_AUTH_DOMAIN=...
PUBLIC_FIREBASE_PROJECT_ID=...
PUBLIC_FIREBASE_STORAGE_BUCKET=...
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
PUBLIC_FIREBASE_APP_ID=...
```

Install dependencies and start the dev server:

```sh
bun install
bun run dev
```

Or use the makefile shortcut, which installs, syncs, and starts the dev server:

```sh
make dev
```

### Available scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `bun run dev`     | Start the Vite dev server                  |
| `bun run build`   | Build the production bundle into `build/`  |
| `bun run preview` | Preview the production build locally       |
| `bun run check`   | Type-check the project with `svelte-check` |

## Building

```sh
bun run build
```

This runs the Vite build and a post-build step (`common/plugins/clean-inline-scripts.js`) to keep
scripts external for Manifest V3 compliance. The output is written to `build/`.

## Loading the extension

1. Run `bun run build`.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the `build/` directory.

The popup, background service worker, and content script are all included in the build output.

## Deployment (web app)

The web app is deployed to **Firebase Hosting** from the `build/` directory (see `firebase.json`).
GitHub Actions workflows under `.github/workflows/` handle preview deploys on pull requests and
production deploys on merge.

[dnr]: https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest
