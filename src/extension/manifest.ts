import packageJson from "../../package.json";

export const manifest: chrome.runtime.ManifestV3 = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
  manifest_version: 3,
  background: { service_worker: "src/extension/background.ts" },
  //   icons: {
  //     "16": "resources/icons/16x16.png",
  //     "48": "resources/icons/48x48.png",
  //     "128": "resources/icons/128x128.png",
  //   },
  permissions: ["declarativeNetRequest", "storage"],
  host_permissions: ["<all_urls>"],
  content_security_policy: {
    extension_pages:
      "script-src 'self'; script-src-elem https://firebasestorage.googleapis.com; object-src 'self'",
  },
  action: { default_popup: "index.html" },
};
