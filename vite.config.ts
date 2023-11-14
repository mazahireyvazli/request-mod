import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

import packageJSON from "./package.json";

export const cdnPackages = {
  react: `https://cdn.jsdelivr.net/npm/react@${packageJSON.dependencies.react}/+esm`,
  "react-dom/client": `https://cdn.jsdelivr.net/npm/react-dom@${packageJSON.dependencies.react}/client/+esm`,
  lodash: `https://cdn.jsdelivr.net/npm/lodash-es@${packageJSON.dependencies.lodash}/+esm`,
  "react-router-dom": `https://cdn.jsdelivr.net/npm/react-router-dom@${packageJSON.dependencies["react-router-dom"]}/+esm`,
  cdbreact: `https://cdn.jsdelivr.net/npm/cdbreact@${packageJSON.dependencies["cdbreact"]}/dist/index.min.js`,
  clsx: `https://cdn.jsdelivr.net/npm/clsx@${packageJSON.dependencies.clsx}/+esm`,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      external: Object.keys(cdnPackages),
      output: {
        format: "esm",
        paths: {
          ...cdnPackages,
        },
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
