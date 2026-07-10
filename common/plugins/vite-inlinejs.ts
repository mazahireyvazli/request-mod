import { minifySync, transformWithOxc, type Plugin, type ResolvedConfig } from "vite";

import { shouldMinify } from "./utils";

const INLINEJS_QUERY = "?inlinejs";
const INLINEJS_AND_SIDE_EFFECT_QUERY = "?inlinejs&sideeffect";

export function inlinejsPlugin(): Plugin {
  let config: ResolvedConfig | null = null;

  return {
    name: "inlinejs",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    load: {
      filter: {
        id: [new RegExp("/" + INLINEJS_QUERY + "$"), new RegExp("/" + INLINEJS_AND_SIDE_EFFECT_QUERY + "$")],
      },
      async handler(id) {
        const isSideEffect = id.endsWith(INLINEJS_AND_SIDE_EFFECT_QUERY);
        const queryLength = isSideEffect ? INLINEJS_AND_SIDE_EFFECT_QUERY.length : INLINEJS_QUERY.length;

        const filePath = id.slice(0, -queryLength);
        this.addWatchFile(filePath);

        let source = await Bun.file(filePath).text();

        const transformed = await transformWithOxc(source, filePath);
        source = transformed.code;

        if (shouldMinify({ mode: config?.mode })) {
          const minified = minifySync(filePath, source);
          source = minified.code;
        }

        return `${isSideEffect ? source + "\n" : ""};export default ${JSON.stringify(source)};`;
      },
    },
  };
}
