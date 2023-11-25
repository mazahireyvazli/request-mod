import fs from "fs";
import { PluginOption, defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

import packageJSON from "./package.json";
import { manifest } from "./src/extension/manifest";

export const cdnPackages = {
  react: `https://cdn.jsdelivr.net/npm/react@${packageJSON.dependencies.react}/+esm`,
  "react-dom/client": `https://cdn.jsdelivr.net/npm/react-dom@${packageJSON.dependencies.react}/client/+esm`,
  lodash: `https://cdn.jsdelivr.net/npm/lodash-es@${packageJSON.dependencies.lodash}/+esm`,
  "react-router-dom": `https://cdn.jsdelivr.net/npm/react-router-dom@${packageJSON.dependencies["react-router-dom"]}/+esm`,
  cdbreact: `https://cdn.jsdelivr.net/npm/cdbreact@${packageJSON.dependencies["cdbreact"]}/dist/index.min.js`,
  clsx: `https://cdn.jsdelivr.net/npm/clsx@${packageJSON.dependencies.clsx}/+esm`,
};

function createExtensionManifest(): PluginOption {
  return {
    name: "make-manifest",
    async writeBundle() {
      fs.writeFileSync(
        "./dist/manifest.json",
        JSON.stringify(manifest, null, 2),
      );
      console.log(`Manifest file created successfully`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createExtensionManifest(), splitVendorChunkPlugin()],
  build: {
    manifest: "app-manifest.json",
    rollupOptions: {
      external: Object.keys(cdnPackages),
      output: {
        format: "esm",
        exports: "named",
        paths: {
          ...cdnPackages,
        },
        // entryFileNames: `assets/[name].js`,
        // chunkFileNames: `assets/[name].js`,
        // assetFileNames: `assets/[name].[ext]`,
      },
      input: {
        index: "index.html",
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
