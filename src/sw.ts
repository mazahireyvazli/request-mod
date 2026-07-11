// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from "$service-worker";

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

const SW_ID = "main-sw";
const CACHE_PREFIX = `cc-${SW_ID}`;

const ASSETS_CACHE = `${CACHE_PREFIX}-assets-${version}`;
const ASSETS = [
  ...build, // the app itself
  ...files, // everything in `static`
];

self.addEventListener("install", async (event) => {
  await self.skipWaiting();

  async function addAssetsToCache() {
    const cache = await self.caches.open(ASSETS_CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addAssetsToCache());
});

self.addEventListener("activate", (event) => {
  async function deleteOldCaches() {
    const cacheKeys = await self.caches.keys();

    return Promise.all(
      cacheKeys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== ASSETS_CACHE)
        .map((key) => self.caches.delete(key)),
    );
  }

  event.waitUntil(Promise.all([deleteOldCaches(), self.clients.claim()]));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});

const respondAssets = async (event: FetchEvent) => {
  const url = new URL(event.request.url);

  const cache = await self.caches.open(ASSETS_CACHE);
  const response = await cache.match(url.pathname);
  if (response) {
    return response;
  }

  return fetch(event.request);
};

self.addEventListener("fetch", async (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (ASSETS.includes(url.pathname)) {
    event.respondWith(respondAssets(event));
  }
});
