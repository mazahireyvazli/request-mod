import { ManifestV3Export } from "@crxjs/vite-plugin";
import packageJson from "../../package.json";

export const manifest: ManifestV3Export = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
  manifest_version: 3,
  background: { service_worker: "src/extension/background.ts", type: "module" },
  //   icons: {
  //     "16": "resources/icons/16x16.png",
  //     "48": "resources/icons/48x48.png",
  //     "128": "resources/icons/128x128.png",
  //   },
  permissions: ["declarativeNetRequest", "tabs", "storage", "identity"],
  host_permissions: ["<all_urls>"],
  oauth2: {
    client_id:
      "669219191683-aertjrlmlq5deff35ut5etchp7g9g4l0.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/userinfo.email"],
  },
  content_security_policy: {
    // extension_pages:
    //   "script-src 'self'; script-src-elem https://cdn.jsdelivr.net; object-src 'self'",
  },
  action: { default_popup: "index.html" },
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjI/fwWs/5oeFO375zDJLN5CZsRbAT+i8/FWMAfBWVfKGvFPkEaC05AqHJFue5dF8ojg5c7/SfP/SD39i9fE9XMKdNQv0Sbb6cYOBFGzPXwYdOgtl1K9IuNReH4yuH0r676RwS7BbWZ2hI0SWrAN2eW2EkgkPdA0L+ng7OGWbFURZcTGg9tfYaz+qwHiQeGgGdOjFZwXV1BLrJVOEAwuAq/4X7zn0toEfq7GYBbmz7ieAa2V1br7paMlGrrd9a3s9CqLykE33WirbTXRm780ks5b2/eCY54XixbKx3J4eF9tKBGXMg1yWhZ+s0fhn3FoN/gYKjbCccOhqIKjgfWwdvwIDAQAB",
};
