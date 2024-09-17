import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "fs";
import { PluginOption, defineConfig } from "vite";

import path from "path";
import { manifest } from "./src/extension/manifest";

const manifestFileName = "app-manifest.json";

export const appManifestGenerator = (
  manifestFileName: string,
): PluginOption => {
  return {
    name: "transform-file",

    async writeBundle(options, bundle) {
      const outDir = options.dir;

      const writeManifest = (manifestData: any) => {
        writeFileSync(
          path.resolve(outDir, `${manifestFileName}`),
          JSON.stringify(manifestData, null, "\t"),
        );
      };

      const manifestData = {};

      const keys = Object.keys(bundle);

      keys.forEach((k) => {
        const assetOrChunk = bundle[k];

        if (assetOrChunk.type === "asset") {
          manifestData[assetOrChunk.name ?? assetOrChunk.fileName] = {
            file: assetOrChunk.fileName,
            type: assetOrChunk.type,
          };
        }

        if (assetOrChunk.type === "chunk") {
          manifestData[assetOrChunk.name ?? assetOrChunk.fileName] = {
            file: assetOrChunk.fileName,
            type: assetOrChunk.type,
            isEntry: assetOrChunk.isEntry,
          };
        }
      });

      writeManifest(manifestData);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    // splitVendorChunkPlugin(),
    appManifestGenerator(manifestFileName),
  ],
  build: {
    manifest: manifestFileName,
    rollupOptions: {
      output: {
        format: "esm",
        exports: "named",
        entryFileNames: "js/[name]-[hash:16].js",
        chunkFileNames: "js/[name]-[hash:16].js",
        assetFileNames: "assets/[name]-[hash:16][extname]",
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
