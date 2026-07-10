import { bundle as lightningBundle } from "lightningcss";
import { rmSync } from "node:fs";
import path from "node:path";
import { minifySync, transformWithOxc, type Plugin, type ResolvedConfig } from "vite";

import { shouldMinify } from "./utils";

export const TEMP_APP_HTML = path.resolve(".svelte-kit/temp-app.html");

const APP_HTML_PATH = path.resolve("src/app.html");

const bundleCSS = (filePath: string, minify: boolean): string => {
  const { code } = lightningBundle({ filename: filePath, minify });
  return code.toString();
};

const inlineTS = async (filePath: string, minify: boolean): Promise<string> => {
  let source = await Bun.file(filePath).text();
  const transformed = await transformWithOxc(source, filePath);
  source = transformed.code;
  if (minify) {
    source = minifySync(filePath, source).code;
  }
  return source;
};

const transformAppHtml = async (
  html: string,
  htmlDir: string,
  minify: boolean,
  importmap?: Record<string, unknown>,
): Promise<string> => {
  const rewriter = new HTMLRewriter().on("*", {
    async element(element) {
      if (element.tagName === "script" && element.hasAttribute("inline")) {
        const src = element.getAttribute("src");
        if (src) {
          const code = await inlineTS(path.resolve(htmlDir, src), minify);
          element.setInnerContent(code, { html: true });
          element.setAttribute("type", "text/javascript");
          element.removeAttribute("src");
          element.removeAttribute("inline");
        }
      }

      if (element.tagName === "script" && element.getAttribute("type") === "importmap" && importmap) {
        element.setInnerContent(JSON.stringify(importmap, null, minify ? 0 : 2));
      }

      if (element.tagName === "style" && element.hasAttribute("inline")) {
        const src = element.getAttribute("src");
        if (src) {
          const code = bundleCSS(path.resolve(htmlDir, src), minify);
          element.setInnerContent(code, { html: true });
          element.removeAttribute("src");
          element.removeAttribute("inline");
        }
      }
    },
  });

  return rewriter.transform(html);
};

/**
 * Must be awaited before sveltekit() is called in vite.config.ts so the temp
 * file exists when SvelteKit loads svelte.config.js and resolves appTemplate.
 */
export const prepareAppHtml = async (minify = false, importmap?: Record<string, unknown>): Promise<void> => {
  const html = await Bun.file(APP_HTML_PATH).text();
  const transformed = await transformAppHtml(html, path.dirname(APP_HTML_PATH), minify, importmap);
  Bun.write(TEMP_APP_HTML, transformed);
};

export async function transformSvelteKitHtmlPlugin({
  mode,
  importmap,
}: {
  mode?: string;
  importmap?: Record<string, unknown>;
}): Promise<Plugin> {
  // Must run before sveltekit() so the temp file exists when svelte.config.js
  // resolves kit.files.appTemplate.
  await prepareAppHtml(shouldMinify({ mode }), importmap);

  let config: ResolvedConfig | null = null;

  return {
    name: "transform-sveltekit-html",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    // Re-run in dev when app.html changes (SvelteKit watches it but uses our temp copy).
    async handleHotUpdate({ file, server }) {
      if (file === APP_HTML_PATH) {
        await prepareAppHtml(shouldMinify({ mode: config?.mode }), importmap);
        server.ws.send({ type: "full-reload" });
      }
    },
    closeBundle() {
      try {
        rmSync(TEMP_APP_HTML);
      } catch {
        // already gone
      }
    },
  };
}
