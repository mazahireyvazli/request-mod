import adapter from "@sveltejs/adapter-static";

/**
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  // preprocess: [
  //   {
  //     name: "inline",
  //     script: async (args) => {
  //       if (!("data-inline" in args.attributes) || !args.filename || typeof args.attributes.src !== "string") {
  //         return;
  //       }

  //       const filePath = Bun.resolveSync(args.attributes.src, path.dirname(args.filename));

  //       const source = await Bun.file(filePath).text();
  //       const { code, map } = await transformWithOxc(source, args.filename);

  //       return { code, map, attributes: { "data-inline": true }, dependencies: [filePath] };
  //     },
  //   },
  // ],

  compilerOptions: {
    // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
    runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),

    cssHash(args) {
      return `scoped-${args.hash(args.filename ?? args.css)}`;
    },

    experimental: {
      async: true,
    },
  },
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      pages: "build",
      assets: "build",
      // fallback: "index.html",
      precompress: false,
      strict: true,
    }),
    prerender: {
      entries: ["*", "/index.html"],
      handleUnseenRoutes: "ignore",
    },
    appDir: "internal",

    router: {
      type: "hash",
      resolution: "client",
    },

    version: {
      name: "0.0.4", // used for generating file hashes, service worker and etc.
    },

    files: {
      serviceWorker: "src/sw.ts",
    },

    env: {
      privatePrefix: "PRIVATE_",
      publicPrefix: "PUBLIC_",
    },

    inlineStyleThreshold: 8192,

    typescript: {
      config: (config) => {
        return config;
      },
    },

    experimental: {
      remoteFunctions: true,
    },

    serviceWorker: {
      register: false,
    },
  },
};

export default config;
